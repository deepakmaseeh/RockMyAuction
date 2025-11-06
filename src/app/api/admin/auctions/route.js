import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Auction from '@/lib/models/Auction';
import Lot from '@/lib/models/Lot';
import EventLog from '@/lib/models/EventLog';

// GET /api/admin/auctions - List all auctions
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const auctions = await Auction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Auction.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: auctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/auctions - Create new auction
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      );
    }
    
    // Check if slug exists
    const existing = await Auction.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }
    
    const auction = new Auction({
      ...body,
      startAt: body.startAt ? new Date(body.startAt) : new Date(),
      endAt: body.endAt ? new Date(body.endAt) : new Date(),
    });
    
    await auction.save();
    
    // Log event
    await EventLog.create({
      entityType: 'Auction',
      entityId: auction._id,
      action: 'create',
      data: { title: auction.title }
    });
    
    return NextResponse.json({
      success: true,
      data: auction
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





