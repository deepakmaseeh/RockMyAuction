import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lot from "@/lib/models/Lot";
import EventLog from "@/lib/models/EventLog";

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { auctionId, order = [], updates = [], userId = null } = body;

    if (!auctionId) {
      return NextResponse.json(
        { success: false, error: "auctionId is required" },
        { status: 400 }
      );
    }

    const sequenceUpdates = Array.isArray(order) && order.length > 0
      ? order.map((lotId, index) => ({
          lotId,
          sequence: index + 1,
        }))
      : updates;

    if (!Array.isArray(sequenceUpdates) || sequenceUpdates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No ordering data provided" },
        { status: 400 }
      );
    }

    const lotIds = sequenceUpdates.map((entry) => entry.lotId);
    const lots = await Lot.find({
      _id: { $in: lotIds },
      auctionId,
    }).select("_id sequence");

    if (lots.length !== sequenceUpdates.length) {
      return NextResponse.json(
        {
          success: false,
          error: "One or more lot IDs are invalid or do not belong to the auction",
        },
        { status: 400 }
      );
    }

    const bulkOps = sequenceUpdates.map(({ lotId, sequence }) => ({
      updateOne: {
        filter: { _id: lotId },
        update: {
          $set: {
            sequence,
            lastSequencedById: userId || null,
            sequencedAt: new Date(),
          },
        },
      },
    }));

    await Lot.bulkWrite(bulkOps);

    await EventLog.create({
      entityType: "Auction",
      entityId: auctionId,
      action: "lot_reorder",
      data: {
        updates: sequenceUpdates,
      },
    });

    return NextResponse.json({
      success: true,
      updated: sequenceUpdates.length,
    });
  } catch (error) {
    console.error("Error reordering lots:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

