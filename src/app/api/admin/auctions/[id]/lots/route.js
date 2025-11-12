import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/lib/models/Auction";
import Lot from "@/lib/models/Lot";
import EventLog from "@/lib/models/EventLog";
import { validateLotData } from "@/lib/validators/lot";

function sanitizeLotPayload(payload) {
  const {
    lotNumber,
    title,
    subtitle = "",
    descriptionHtml = "",
    additionalDescriptionHtml = "",
    descriptionText = "",
    additionalDescriptionText = "",
    companyCategory = "",
    category = "",
    quantity = 1,
    estimateLow = 0,
    estimateHigh = 0,
    startingBid = 0,
    reservePrice = 0,
    status = "draft",
    featured = false,
    requiresApproval = false,
    approvalNotes = "",
    attributes = {},
    metadata = {},
    images = [],
    documents = [],
    videoUrl = "",
  } = payload;

  return {
    lotNumber: String(lotNumber).trim(),
    title: String(title).trim(),
    subtitle: subtitle?.trim() || "",
    descriptionHtml: descriptionHtml || "",
    additionalDescriptionHtml: additionalDescriptionHtml || "",
    descriptionText: descriptionText || "",
    additionalDescriptionText: additionalDescriptionText || "",
    companyCategory: companyCategory?.trim() || "",
    category: category?.trim() || "",
    quantity: Number(quantity) || 1,
    estimateLow: Number(estimateLow) || 0,
    estimateHigh: Number(estimateHigh) || 0,
    startingBid: Number(startingBid) || 0,
    reservePrice: Number(reservePrice) || 0,
    status,
    featured: Boolean(featured),
    requiresApproval: Boolean(requiresApproval),
    attributes: attributes || {},
    metadata: metadata || {},
    images: Array.isArray(images) ? images : [],
    documents: Array.isArray(documents) ? documents : [],
    videoUrl: videoUrl?.trim() || "",
    approvalNotes: approvalNotes || "",
  };
}

function serializeLot(lot) {
  if (!lot) return lot;
  return {
    ...lot,
    description: lot.descriptionHtml || lot.descriptionText || "",
    additionalDescription:
      lot.additionalDescriptionHtml || lot.additionalDescriptionText || "",
  };
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "sequence";
    const order = searchParams.get("order") === "desc" ? -1 : 1;
    const status = searchParams.get("status");
    const search = searchParams.get("q");
    const includeArchived = searchParams.get("includeArchived") === "true";

    const auctionId = params.id;

    const auction = await Auction.findById(auctionId).select("_id");
    if (!auction) {
      return NextResponse.json(
        { success: false, error: "Auction not found" },
        { status: 404 }
      );
    }

    const query = { auctionId };
    if (!includeArchived) {
      query.isArchived = { $ne: true };
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { lotNumber: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { descriptionText: { $regex: search, $options: "i" } },
      ];
    }

    const sortDefinition = (() => {
      switch (sort) {
        case "lotNumber":
          return { lotNumber: order };
        case "title":
          return { title: order };
        case "status":
          return { status: order, sequence: 1 };
        default:
          return { sequence: order, lotNumber: 1 };
      }
    })();

    const lots = await Lot.find(query)
      .sort(sortDefinition)
      .lean();

    return NextResponse.json({
      success: true,
      data: lots.map((lot) => serializeLot(lot)),
      meta: {
        count: lots.length,
      },
    });
  } catch (error) {
    console.error("Error fetching lots:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();

    const auctionId = params.id;
    const body = await request.json();
    const payload = sanitizeLotPayload(body);

    const auction = await Auction.findById(auctionId).select("_id title status");
    if (!auction) {
      return NextResponse.json(
        { success: false, error: "Auction not found" },
        { status: 404 }
      );
    }

    const validation = validateLotData({
      lotNumber: payload.lotNumber,
      title: payload.title,
      estimateLow: payload.estimateLow,
      estimateHigh: payload.estimateHigh,
      reservePrice: payload.reservePrice,
      startingBid: payload.startingBid,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const duplicate = await Lot.findOne({
      auctionId,
      lotNumber: payload.lotNumber,
    }).select("_id");

    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "Lot number already exists for this auction" },
        { status: 409 }
      );
    }

    const lot = await Lot.create({
      ...payload,
      auctionId,
      approval: {
        status: payload.requiresApproval ? "pending" : "approved",
        notes: payload.approvalNotes || "",
      },
    });

    await EventLog.create({
      entityType: "Lot",
      entityId: lot._id,
      action: "create",
      data: {
        auctionId,
        lotNumber: lot.lotNumber,
        title: lot.title,
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeLot(lot.toObject()),
    });
  } catch (error) {
    console.error("Error creating lot:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

