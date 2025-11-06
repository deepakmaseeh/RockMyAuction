import { connectDB } from '@/lib/db'
import Auction from '@/lib/models/Auction'
import { NextResponse } from 'next/server'

/**
 * Get all auctions with optional filtering
 */
export async function getAllAuctions(req) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const active = searchParams.get('active') // 'true' to get only active auctions
    const category = searchParams.get('category')
    const createdBy = searchParams.get('createdBy')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const query = {}
    
    // Filter by status
    if (status) {
      query.status = status
    }
    
    // Filter by active (not ended)
    if (active === 'true') {
      const now = new Date()
      query.endAt = { $gt: now }
      query.status = { $in: ['live', 'scheduled'] }
    }
    
    // Filter by category
    if (category) {
      query.category = category
    }
    
    // Filter by creator
    if (createdBy) {
      query.createdById = createdBy
    }
    
    const auctions = await Auction.find(query)
      .populate('createdById', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
    
    const total = await Auction.countDocuments(query)
    
    // Enrich auctions with legacy fields for frontend compatibility
    const enrichedAuctions = auctions.map(auction => ({
      ...auction,
      endDate: auction.endAt,
      endTime: auction.endAt,
      startDate: auction.startAt,
      startTime: auction.startAt,
      createdBy: auction.createdById,
      // Legacy fields (may not exist in model, but frontend expects them)
      category: auction.category || '',
      images: auction.images || [],
      currentBid: auction.currentBid || 0,
      reservePrice: auction.reservePrice || null,
      quantity: auction.quantity || 1
    }))
    
    return NextResponse.json({
      success: true,
      auctions: enrichedAuctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get auctions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch auctions' },
      { status: 500 }
    )
  }
}

/**
 * Create a new auction
 */
export async function createAuction(req) {
  try {
    await connectDB()
    const body = await req.json()

    // Validation
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!body.endTime && !body.endAt) {
      return NextResponse.json(
        { success: false, error: 'End time is required' },
        { status: 400 }
      )
    }

    // Generate slug from title if not provided
    let slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Ensure slug is unique
    let slugCount = await Auction.countDocuments({ slug })
    if (slugCount > 0) {
      slug = `${slug}-${Date.now()}`
    }

    // Parse dates
    const startAt = body.startTime ? new Date(body.startTime) : new Date()
    const endAt = body.endTime ? new Date(body.endTime) : new Date(body.endAt)

    // Determine status
    let status = body.status || 'draft'
    if (status === 'draft' && startAt <= new Date() && endAt > new Date()) {
      status = 'live'
    } else if (endAt <= new Date()) {
      status = 'closed'
    }

    const newAuction = new Auction({
      slug,
      title: body.title.trim(),
      description: body.description || '',
      startAt,
      endAt,
      timezone: body.timezone || 'UTC',
      buyerPremiumPct: body.buyerPremiumPct || 0,
      termsHtml: body.termsHtml || '',
      status,
      createdById: body.createdById || body.createdBy || null
    })

    await newAuction.save()
    
    // Return with legacy fields for frontend compatibility
    const auctionResponse = {
      ...newAuction.toObject(),
      endDate: endAt,
      endTime: endAt,
      startDate: startAt,
      startTime: startAt,
      category: body.category,
      images: body.images || [],
      currentBid: body.startingBid || body.currentBid || 0,
      reservePrice: body.reservePrice || null,
      quantity: body.quantity || 1
    }
    
    return NextResponse.json({
      success: true,
      message: 'Auction created successfully',
      auction: auctionResponse
    }, { status: 201 })
  } catch (error) {
    console.error('Create auction error:', error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Auction slug already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create auction' },
      { status: 500 }
    )
  }
}

/**
 * Get active auctions (not ended and status is live or scheduled)
 */
export async function getActiveAuctions(req) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const now = new Date()
    const query = {
      endAt: { $gt: now },
      status: { $in: ['live', 'scheduled'] }
    }
    
    // Filter by category if provided
    if (category) {
      query.category = category
    }
    
    const auctions = await Auction.find(query)
      .populate('createdById', 'name email')
      .sort({ endAt: 1 }) // Sort by ending soonest first
      .limit(limit)
      .lean()
    
    // Add computed fields for frontend compatibility
    const enrichedAuctions = auctions.map(auction => ({
      ...auction,
      endDate: auction.endAt,
      endTime: auction.endAt,
      startDate: auction.startAt,
      startTime: auction.startAt,
      createdBy: auction.createdById,
      // Legacy fields for frontend compatibility
      category: auction.category || '',
      images: auction.images || [],
      currentBid: auction.currentBid || 0,
      reservePrice: auction.reservePrice || null,
      quantity: auction.quantity || 1
    }))
    
    return NextResponse.json({
      success: true,
      auctions: enrichedAuctions,
      count: enrichedAuctions.length
    })
  } catch (error) {
    console.error('Get active auctions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active auctions' },
      { status: 500 }
    )
  }
}





