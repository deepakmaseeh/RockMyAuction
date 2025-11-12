import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lot from "@/lib/models/Lot";
import EventLog from "@/lib/models/EventLog";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { auctionId, mappings = [] } = body;

    if (!auctionId) {
      return NextResponse.json(
        { success: false, error: "auctionId is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return NextResponse.json(
        { success: false, error: "mappings array is required" },
        { status: 400 }
      );
    }

    const originalNumbers = mappings.map((entry) => entry.originalLotNumber);
    const newNumbers = mappings.map((entry) => entry.newLotNumber);

    if (new Set(newNumbers).size !== newNumbers.length) {
      return NextResponse.json(
        { success: false, error: "New lot numbers contain duplicates" },
        { status: 400 }
      );
    }

    const lots = await Lot.find({
      auctionId,
      lotNumber: { $in: originalNumbers },
    }).select("_id lotNumber");

    if (lots.length !== mappings.length) {
      const existingNumbers = new Set(lots.map((lot) => lot.lotNumber));
      const missing = originalNumbers.filter((num) => !existingNumbers.has(num));
      return NextResponse.json(
        {
          success: false,
          error: `Lot numbers not found: ${missing.join(", ")}`,
        },
        { status: 404 }
      );
    }

    const existingNewNumbers = await Lot.find({
      auctionId,
      lotNumber: { $in: newNumbers, $nin: originalNumbers },
    }).select("lotNumber");

    if (existingNewNumbers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `New lot numbers already in use: ${existingNewNumbers
            .map((lot) => lot.lotNumber)
            .join(", ")}`,
        },
        { status: 409 }
      );
    }

    const lotMap = new Map(lots.map((lot) => [lot.lotNumber, lot._id]));

    const bulkOps = mappings.map(({ originalLotNumber, newLotNumber }) => ({
      updateOne: {
        filter: {
          _id: lotMap.get(originalLotNumber),
          auctionId,
        },
        update: {
          $set: {
            lotNumber: newLotNumber,
          },
        },
      },
    }));

    await Lot.bulkWrite(bulkOps);

    await EventLog.create({
      entityType: "Auction",
      entityId: auctionId,
      action: "lot_renumber",
      data: {
        mappings,
      },
    });

    return NextResponse.json({
      success: true,
      updated: mappings.length,
    });
  } catch (error) {
    console.error("Error renumbering lots:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

