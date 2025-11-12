import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lot from "@/lib/models/Lot";
import { exportLotsToCSV } from "@/lib/utils/csv";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get("auctionId");
    const fieldsRaw = searchParams.get("fields");

    if (!auctionId) {
      return NextResponse.json(
        { success: false, error: "auctionId is required" },
        { status: 400 }
      );
    }

    const fields = fieldsRaw ? fieldsRaw.split(",") : null;

    const lots = await Lot.find({ auctionId }).sort({ sequence: 1 }).lean();

    const csv = exportLotsToCSV(
      lots.map((lot) => ({
        ...lot,
        description: lot.descriptionHtml || lot.descriptionText || "",
        additionalDescription:
          lot.additionalDescriptionHtml || lot.additionalDescriptionText || "",
      })),
      fields
    );

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="auction-${auctionId}-lots.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting lots:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

