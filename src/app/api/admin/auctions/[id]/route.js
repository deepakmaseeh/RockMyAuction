import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Auction from '@/lib/models/Auction';
import EventLog from '@/lib/models/EventLog';

// GET /api/admin/auctions/[id] - Get single auction
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const auction = await Auction.findById(params.id)
      .populate('createdById', 'name email')
      .lean();
    
    if (!auction) {
      return NextResponse.json(
        { success: false, error: 'Auction not found' },
        { status: 404 }
      );
    }
    
    const lotsCount = 0;
    
    return NextResponse.json({
      success: true,
      data: { ...auction, lotsCount }
    });
  } catch (error) {
    console.error('Error fetching auction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/auctions/[id] - Update auction
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Get previous data for event log
    const previous = await Auction.findById(params.id).lean();
    
    const auction = await Auction.findByIdAndUpdate(
      params.id,
      {
        ...body,
        startAt: body.startAt ? new Date(body.startAt) : undefined,
        endAt: body.endAt ? new Date(body.endAt) : undefined,
      },
      { new: true, runValidators: true }
    );
    
    if (!auction) {
      return NextResponse.json(
        { success: false, error: 'Auction not found' },
        { status: 404 }
      );
    }
    
    // Log event
    await EventLog.create({
      entityType: 'Auction',
      entityId: auction._id,
      action: 'update',
      previousData: previous,
      data: body
    });
    
    return NextResponse.json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error('Error updating auction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/auctions/[id] - Delete auction
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const auction = await Auction.findByIdAndDelete(params.id);
    
    if (!auction) {
      return NextResponse.json(
        { success: false, error: 'Auction not found' },
        { status: 404 }
      );
    }
    
    // Log event
    await EventLog.create({
      entityType: 'Auction',
      entityId: params.id,
      action: 'delete',
      data: { title: auction.title }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Auction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting auction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}






