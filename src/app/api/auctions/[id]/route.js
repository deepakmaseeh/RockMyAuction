import { connectDB } from "@/lib/db";
import Auction from "@/lib/models/Auction";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  const auction = await Auction.findById(params.id);
  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 });
  }

  return NextResponse.json(auction);
}
