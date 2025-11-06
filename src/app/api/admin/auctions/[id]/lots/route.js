import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lot from '@/lib/models/Lot';
import LotImage from '@/lib/models/LotImage';
import EventLog from '@/lib/models/EventLog';

// GET /api/admin/auctions/[id]/lots - List lots for an auction
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const query = { auctionId: params.id };
    if (status) query.status = status;
    if (featured !== null) query.featured = featured === 'true';
    
    const lots = await Lot.find(query)
      .sort({ lotNumber: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    // Populate images
    const lotsWithImages = await Promise.all(
      lots.map(async (lot) => {
        const images = await LotImage.find({ lotId: lot._id })
          .sort({ sortOrder: 1 })
          .lean();
        return {
          ...lot,
          lotImages: images.length > 0 ? images : (lot.images || []).map(url => ({ url }))
        };
      })
    );
    
    const total = await Lot.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: lotsWithImages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching lots:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/auctions/[id]/lots - Create new lot
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check lot number uniqueness
    const existing = await Lot.findOne({
      auctionId: params.id,
      lotNumber: body.lotNumber
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Lot number ${body.lotNumber} already exists in this auction` },
        { status: 400 }
      );
    }
    
    // Generate SEO slug if not provided
    if (!body.seoSlug && body.title) {
      body.seoSlug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure uniqueness
      let slug = body.seoSlug;
      let counter = 1;
      while (await Lot.findOne({ seoSlug: slug })) {
        slug = `${body.seoSlug}-${counter}`;
        counter++;
      }
      body.seoSlug = slug;
    }
    
    const lot = new Lot({
      ...body,
      auctionId: params.id
    });
    
    await lot.save();
    
    // Handle images
    if (body.images && Array.isArray(body.images)) {
      const lotImages = body.images.map((url, index) => ({
        lotId: lot._id,
        url,
        sortOrder: index,
        alt: body.imageAlts?.[index] || ''
      }));
      
      if (lotImages.length > 0) {
        await LotImage.insertMany(lotImages);
      }
    }
    
    // Log event
    await EventLog.create({
      entityType: 'Lot',
      entityId: lot._id,
      action: 'create',
      data: { lotNumber: lot.lotNumber, title: lot.title }
    });
    
    return NextResponse.json({
      success: true,
      data: lot
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating lot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





