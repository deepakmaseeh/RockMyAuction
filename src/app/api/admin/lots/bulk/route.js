import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lot from '@/lib/models/Lot';
import EventLog from '@/lib/models/EventLog';

// POST /api/admin/lots/bulk - Bulk actions on lots
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { action, lotIds, data } = body;
    
    if (!action || !lotIds || !Array.isArray(lotIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: action and lotIds array required' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'publish':
        result = await Lot.updateMany(
          { _id: { $in: lotIds } },
          { $set: { status: 'published' } }
        );
        break;
        
      case 'unpublish':
        result = await Lot.updateMany(
          { _id: { $in: lotIds } },
          { $set: { status: 'draft' } }
        );
        break;
        
      case 'feature':
        result = await Lot.updateMany(
          { _id: { $in: lotIds } },
          { $set: { featured: true } }
        );
        break;
        
      case 'unfeature':
        result = await Lot.updateMany(
          { _id: { $in: lotIds } },
          { $set: { featured: false } }
        );
        break;
        
      case 'move':
        if (!data?.auctionId) {
          return NextResponse.json(
            { success: false, error: 'auctionId required for move action' },
            { status: 400 }
          );
        }
        result = await Lot.updateMany(
          { _id: { $in: lotIds } },
          { $set: { auctionId: data.auctionId } }
        );
        break;
        
      case 'renumber':
        if (!data?.renumbering) {
          return NextResponse.json(
            { success: false, error: 'renumbering map required for renumber action' },
            { status: 400 }
          );
        }
        // Renumber lots one by one to avoid conflicts
        const updates = [];
        for (const [lotId, newLotNumber] of Object.entries(data.renumbering)) {
          updates.push(
            Lot.findByIdAndUpdate(lotId, { lotNumber: newLotNumber })
          );
        }
        await Promise.all(updates);
        result = { modifiedCount: updates.length };
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
    // Log bulk event
    await EventLog.create({
      entityType: 'Lot',
      entityId: lotIds[0], // Use first lot ID as reference
      action: action,
      data: { lotIds, count: result.modifiedCount || lotIds.length }
    });
    
    return NextResponse.json({
      success: true,
      message: `Bulk ${action} completed`,
      modifiedCount: result.modifiedCount || lotIds.length
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





