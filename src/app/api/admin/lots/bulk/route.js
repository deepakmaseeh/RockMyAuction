import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lot from "@/lib/models/Lot";
import EventLog from "@/lib/models/EventLog";
import { validateLotData } from "@/lib/validators/lot";

function buildUpdate(action, field, value) {
  switch (action) {
    case "update_field":
      if (!field) {
        throw new Error("Field is required for update_field action");
      }
      if (field === "lotNumber" || field === "title") {
        throw new Error("lotNumber and title cannot be bulk edited");
      }
      if (["estimateLow", "estimateHigh", "reservePrice", "startingBid"].includes(field)) {
        return { [field]: Number(value) || 0 };
      }
      if (field === "requiresApproval") {
        const requiresApproval = Boolean(value);
        return {
          requiresApproval,
          approval: {
            status: requiresApproval ? "pending" : "approved",
          },
        };
      }
      if (field === "featured") {
        return { featured: Boolean(value) };
      }
      return { [field]: value };
    case "publish":
      return { status: "published" };
    case "unpublish":
      return { status: "draft" };
    case "feature":
      return { featured: true };
    case "unfeature":
      return { featured: false };
    case "mark_sold":
      return { status: "sold" };
    case "approve":
      return {
        requiresApproval: false,
        approval: {
          status: "approved",
        },
      };
    case "reject":
      return {
        approval: {
          status: "rejected",
          notes: value || "",
        },
      };
    case "cancel":
      return {
        status: "cancelled",
        cancelledAt: new Date(),
      };
    default:
      return null;
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, lotIds = [], field, value } = body;

    if (!Array.isArray(lotIds) || lotIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "lotIds array is required" },
        { status: 400 }
      );
    }

    if (action === "delete") {
      const lots = await Lot.find({ _id: { $in: lotIds } }).select(
        "_id auctionId lotNumber title"
      );

      await Lot.deleteMany({ _id: { $in: lotIds } });

      await EventLog.insertMany(
        lots.map((lot) => ({
          entityType: "Lot",
          entityId: lot._id,
          action: "delete",
          data: {
            auctionId: lot.auctionId,
            lotNumber: lot.lotNumber,
            title: lot.title,
          },
        }))
      );

      return NextResponse.json({
        success: true,
        modifiedCount: lotIds.length,
      });
    }

    const update = buildUpdate(action, field, value);
    if (!update) {
      return NextResponse.json(
        { success: false, error: `Unsupported action: ${action}` },
        { status: 400 }
      );
    }

    if (update.estimateLow !== undefined || update.estimateHigh !== undefined) {
      // Validate estimate ranges by loading each lot
      const lots = await Lot.find({ _id: { $in: lotIds } }).select(
        "estimateLow estimateHigh lotNumber title startingBid reservePrice"
      );

      for (const lot of lots) {
        const validation = validateLotData({
          lotNumber: lot.lotNumber,
          title: lot.title,
          estimateLow: update.estimateLow ?? lot.estimateLow,
          estimateHigh: update.estimateHigh ?? lot.estimateHigh,
          reservePrice: update.reservePrice ?? lot.reservePrice,
          startingBid: update.startingBid ?? lot.startingBid,
        });

        if (!validation.valid) {
          return NextResponse.json(
            {
              success: false,
              error: `Lot ${lot.lotNumber}: ${validation.errors.join(", ")}`,
            },
            { status: 400 }
          );
        }
      }
    }

    const result = await Lot.updateMany(
      { _id: { $in: lotIds } },
      { $set: update }
    );

    await EventLog.create({
      entityType: "Lot",
      entityId: lotIds[0],
      action: "bulk_update",
      data: {
        action,
        field,
        value,
        lotIds,
      },
    });

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

