import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lot from "@/lib/models/Lot";
import EventLog from "@/lib/models/EventLog";
import { validateLotData } from "@/lib/validators/lot";

const editableFields = new Set([
  "lotNumber",
  "title",
  "subtitle",
  "companyCategory",
  "category",
  "descriptionHtml",
  "additionalDescriptionHtml",
  "descriptionText",
  "additionalDescriptionText",
  "quantity",
  "estimateLow",
  "estimateHigh",
  "startingBid",
  "reservePrice",
  "status",
  "featured",
  "requiresApproval",
  "attributes",
  "metadata",
  "images",
  "documents",
  "videoUrl",
  "sequence",
  "approval",
  "approvalNotes",
]);

function sanitizeUpdate(body = {}) {
  const payload = {};

  for (const [key, value] of Object.entries(body)) {
    if (!editableFields.has(key)) continue;

    switch (key) {
      case "lotNumber":
      case "title":
      case "subtitle":
      case "companyCategory":
      case "category":
        payload[key] = value?.trim?.() ?? "";
        break;
      case "descriptionHtml":
      case "additionalDescriptionHtml":
      case "descriptionText":
      case "additionalDescriptionText":
        payload[key] = value || "";
        break;
      case "quantity":
      case "estimateLow":
      case "estimateHigh":
      case "startingBid":
      case "reservePrice":
      case "sequence":
        payload[key] = Number(value) || 0;
        break;
      case "featured":
      case "requiresApproval":
        payload[key] = Boolean(value);
        break;
      case "attributes":
      case "metadata":
        payload[key] = value || {};
        break;
      case "images":
      case "documents":
        payload[key] = Array.isArray(value) ? value : [];
        break;
      case "approval":
        payload[key] = value || {};
        break;
      case "status":
        payload[key] = value;
        break;
      case "videoUrl":
        payload[key] = value?.trim?.() ?? "";
        break;
      case "approvalNotes":
        payload.approvalNotes = value?.trim?.() || "";
        break;
      default:
        payload[key] = value;
    }
  }

  return payload;
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const lot = await Lot.findById(params.lotId).lean();
    if (!lot) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...lot,
        description: lot.descriptionHtml || lot.descriptionText || "",
        additionalDescription:
          lot.additionalDescriptionHtml || lot.additionalDescriptionText || "",
      },
    });
  } catch (error) {
    console.error("Error fetching lot:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const lotId = params.lotId;
    const existing = await Lot.findById(lotId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const payload = sanitizeUpdate(body);

    if (payload.lotNumber && payload.lotNumber !== existing.lotNumber) {
      const duplicate = await Lot.findOne({
        auctionId: existing.auctionId,
        lotNumber: payload.lotNumber,
        _id: { $ne: lotId },
      }).select("_id");

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: "Lot number already exists in this auction",
          },
          { status: 409 }
        );
      }
    }

    const validation = validateLotData({
      lotNumber: payload.lotNumber ?? existing.lotNumber,
      title: payload.title ?? existing.title,
      estimateLow: payload.estimateLow ?? existing.estimateLow,
      estimateHigh: payload.estimateHigh ?? existing.estimateHigh,
      reservePrice: payload.reservePrice ?? existing.reservePrice,
      startingBid: payload.startingBid ?? existing.startingBid,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    if (payload.requiresApproval === true) {
      payload.approval = {
        ...(payload.approval || existing.approval || {}),
        status: "pending",
      };
    } else if (payload.requiresApproval === false) {
      payload.approval = {
        ...(payload.approval || existing.approval || {}),
        status: payload.approval?.status || "approved",
      };
    }

    if (payload.approvalNotes !== undefined) {
      payload.approval = {
        ...(payload.approval || existing.approval || {}),
        notes: payload.approvalNotes,
      };
      delete payload.approvalNotes;
    }

    const previous = existing.toObject();
    Object.assign(existing, payload);

    await existing.save();

    await EventLog.create({
      entityType: "Lot",
      entityId: existing._id,
      action: "update",
      previousData: {
        lotNumber: previous.lotNumber,
        title: previous.title,
        sequence: previous.sequence,
        status: previous.status,
      },
      data: payload,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...existing.toObject(),
        description: existing.descriptionHtml || existing.descriptionText || "",
        additionalDescription:
          existing.additionalDescriptionHtml || existing.additionalDescriptionText || "",
      },
    });
  } catch (error) {
    console.error("Error updating lot:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const lot = await Lot.findById(params.lotId);
    if (!lot) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 }
      );
    }

    await lot.deleteOne();

    await EventLog.create({
      entityType: "Lot",
      entityId: params.lotId,
      action: "delete",
      data: {
        auctionId: lot.auctionId,
        lotNumber: lot.lotNumber,
        title: lot.title,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lot deleted",
    });
  } catch (error) {
    console.error("Error deleting lot:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

