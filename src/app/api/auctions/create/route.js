import { connectDB } from '@/lib/db'
import Auction from '@/lib/models/Auction'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()

    const newAuction = new Auction({
      title: body.title,
      description: body.description,
      category: body.category,
      images: [body.image],
      currentBid: body.startingBid,
      reservePrice: body.reservePrice || null,
      quantity: body.quantity || 1,
      endsAt: new Date(body.endTime),
      startsAt: new Date(body.startTime),
      status: 'active'
    })

    await newAuction.save()
    
    return NextResponse.json({ 
      success: true,
      message: 'Auction created successfully',
      auction: newAuction 
    })

  } catch (error) {
    console.error('Create auction error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create auction' },
      { status: 500 }
    )
  }
}
