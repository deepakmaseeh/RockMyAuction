import { connectDB } from '@/lib/db';
import Auction from '@/lib/models/Auction';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const newAuction = new Auction({
    title: body.title,
    description: body.description,
    category: body.category,
    images: [body.image],
    currentBid: body.startingBid,
    reservePrice: body.reservePrice,
    quantity: body.quantity,
    endsAt: new Date(body.endTime),
    startsAt: new Date(body.startTime),
  });

  await newAuction.save();
  return NextResponse.json({ message: 'Auction created' });
}
