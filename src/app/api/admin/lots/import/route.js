import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lot from "@/lib/models/Lot";
import { validateLotData } from "@/lib/validators/lot";

function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replace(/^"|"$/g, ""));

  const rows = lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  });

  return { headers, rows };
}

function mapRow(headers, values, columnMap = null) {
  const mapping = columnMap || headers.reduce((acc, header) => {
    acc[header] = header;
    return acc;
  }, {});

  const row = {};
  headers.forEach((header, index) => {
    const targetField = mapping[header];
    if (!targetField) return;
    row[targetField] = values[index]?.trim() ?? "";
  });
  return row;
}

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file");
    const auctionId = formData.get("auctionId");
    const dryRun = formData.get("dryRun") === "true";
    const columnMapRaw = formData.get("columnMap");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "CSV file is required" },
        { status: 400 }
      );
    }

    if (!auctionId) {
      return NextResponse.json(
        { success: false, error: "auctionId is required" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (headers.length === 0) {
      return NextResponse.json(
        { success: false, error: "CSV file is empty" },
        { status: 400 }
      );
    }

    const columnMap = columnMapRaw ? JSON.parse(columnMapRaw) : null;

    const parsedRows = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const values = rows[i];
      const base = mapRow(headers, values, columnMap);

      const lotNumber = base.lotNumber || base["Lot #"] || base["LotNumber"];
      const title = base.title || base["Title"];

      const lotData = {
        lotNumber: lotNumber ? String(lotNumber).trim() : "",
        title: title ? String(title).trim() : "",
        descriptionHtml: base.descriptionHtml || base.description || "",
        additionalDescriptionHtml:
          base.additionalDescriptionHtml || base.additionalDescription || "",
        descriptionText: (base.descriptionText || base.description || "").toString(),
        additionalDescriptionText:
          (base.additionalDescriptionText ||
            base.additionalDescription ||
            "").toString(),
        companyCategory:
          base.companyCategory ||
          base["Company Category"] ||
          base["CompanyCategory"] ||
          "",
        category: base.category || base["Category"] || "",
        estimateLow: Number(base.estimateLow || base["Estimate Low"] || 0) || 0,
        estimateHigh: Number(base.estimateHigh || base["Estimate High"] || 0) || 0,
        reservePrice: Number(base.reservePrice || base["Reserve"] || 0) || 0,
        startingBid: Number(base.startingBid || base["Starting Bid"] || 0) || 0,
        status: base.status || "draft",
        requiresApproval:
          base.requiresApproval === "true" ||
          base.requiresApproval === true ||
          base["Requires Approval"] === "true",
        featured:
          base.featured === "true" ||
          base.featured === true ||
          base["Featured"] === "true",
      };

      const validation = validateLotData({
        lotNumber: lotData.lotNumber,
        title: lotData.title,
        estimateLow: lotData.estimateLow,
        estimateHigh: lotData.estimateHigh,
        reservePrice: lotData.reservePrice,
        startingBid: lotData.startingBid,
      });

      if (!validation.valid) {
        errors.push({
          row: i + 2,
          message: validation.errors.join(", "),
        });
        continue;
      }

      parsedRows.push(lotData);
    }

    if (dryRun) {
      return NextResponse.json({
        success: true,
        valid: parsedRows.length,
        invalid: errors.length,
        errors,
        preview: parsedRows.slice(0, 5),
      });
    }

    if (parsedRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid rows found in CSV",
          errors,
        },
        { status: 400 }
      );
    }

    const existingLotNumbers = await Lot.find({
      auctionId,
      lotNumber: { $in: parsedRows.map((row) => row.lotNumber) },
    }).select("lotNumber");

    const duplicateNumbers = new Set(existingLotNumbers.map((lot) => lot.lotNumber));

    if (duplicateNumbers.size > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate lot numbers found",
          duplicates: Array.from(duplicateNumbers),
        },
        { status: 409 }
      );
    }

    const latest = await Lot.findOne({ auctionId })
      .sort({ sequence: -1 })
      .select("sequence")
      .lean();
    let sequence = latest?.sequence || 0;

    const lotsToInsert = parsedRows.map((row) => {
      sequence += 1;
      return {
        ...row,
        auctionId,
        sequence,
        approval: {
          status: row.requiresApproval ? "pending" : "approved",
        },
      };
    });

    const inserted = await Lot.insertMany(lotsToInsert, { ordered: false });

    return NextResponse.json({
      success: true,
      imported: inserted.length,
      failed: errors.length,
      errors,
    });
  } catch (error) {
    console.error("Error importing lots:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

