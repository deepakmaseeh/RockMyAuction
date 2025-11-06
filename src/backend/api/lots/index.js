import { connectDB } from '@/lib/db'
import Lot from '@/lib/models/Lot'
import Catalogue from '@/lib/models/Catalogue'
import { NextResponse } from 'next/server'

/**
 * Get all lots with optional filtering
 */
export async function getAllLots(req) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const catalogueId = searchParams.get('catalogue')
    const auctionId = searchParams.get('auction')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const query = {}
    if (catalogueId) query.catalogue = catalogueId
    if (auctionId) query.auctionId = auctionId
    if (status) query.status = status
    if (category) query.category = category
    
    const lots = await Lot.find(query)
      .populate('catalogue', 'title auctionDate')
      .populate('auctionId', 'title slug')
      .populate('createdBy', 'name email')
      .sort({ lotNumber: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
    
    const total = await Lot.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      lots,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get lots error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lots' },
      { status: 500 }
    )
  }
}

/**
 * Create a new lot
 */
export async function createLot(req) {
  try {
    await connectDB()
    const body = await req.json()

    // Validation
    if (!body.lotNumber || body.lotNumber.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Lot number is required' },
        { status: 400 }
      )
    }

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    if (body.title.length > 80) {
      return NextResponse.json(
        { success: false, error: 'Title must be 80 characters or less' },
        { status: 400 }
      )
    }

    // Verify catalogue exists if provided
    if (body.catalogue) {
      const catalogue = await Catalogue.findById(body.catalogue)
      if (!catalogue) {
        return NextResponse.json(
          { success: false, error: 'Catalogue not found' },
          { status: 404 }
        )
      }
    }

    // Validate status
    const validStatuses = ['draft', 'published', 'sold', 'passed']
    const status = body.status || 'draft'
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate condition if provided
    if (body.condition) {
      const validConditions = ['excellent', 'very-good', 'good', 'fair', 'poor']
      if (!validConditions.includes(body.condition)) {
        return NextResponse.json(
          { success: false, error: `Condition must be one of: ${validConditions.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Validate numeric fields
    const estimateLow = Math.max(0, parseFloat(body.estimateLow) || 0)
    const estimateHigh = Math.max(0, parseFloat(body.estimateHigh) || 0)
    const startingBid = Math.max(0, parseFloat(body.startingBid) || 0)
    const reservePrice = Math.max(0, parseFloat(body.reservePrice) || 0)

    if (estimateLow > estimateHigh) {
      return NextResponse.json(
        { success: false, error: 'Estimate low must be less than or equal to estimate high' },
        { status: 400 }
      )
    }

    if (reservePrice > 0 && startingBid > 0 && reservePrice < startingBid) {
      return NextResponse.json(
        { success: false, error: 'Reserve price must be greater than or equal to starting bid' },
        { status: 400 }
      )
    }

    // Use provided createdBy or allow null for demo purposes
    const createdBy = body.createdBy || null

    const newLot = new Lot({
      lotNumber: body.lotNumber.trim(),
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || '',
      description: body.description?.trim() || '',
      conditionReport: body.conditionReport?.trim() || '',
      images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
      category: body.category?.trim() || '',
      condition: body.condition || 'good',
      attributes: body.attributes || {},
      quantity: parseInt(body.quantity) || 1,
      estimateLow,
      estimateHigh,
      startingBid,
      reservePrice,
      incrementScheme: body.incrementScheme || null,
      provenance: body.provenance?.trim() || '',
      dimensions: body.dimensions || {},
      weight: body.weight || {},
      catalogue: body.catalogue || null,
      auctionId: body.auctionId || null,
      status: status,
      featured: body.featured === true,
      seoSlug: body.seoSlug?.trim() || '',
      videoUrl: body.videoUrl?.trim() || '',
      createdBy: createdBy,
      metadata: body.metadata || {},
      // Legacy fields for backward compatibility
      estimatedValue: estimateHigh,
      startingPrice: startingBid
    })

    await newLot.save()

    // Add lot to catalogue if provided
    if (body.catalogue) {
      await Catalogue.findByIdAndUpdate(
        body.catalogue,
        { $addToSet: { lots: newLot._id } }
      )

      // Recalculate catalogue metadata
      const lots = await Lot.find({ catalogue: body.catalogue })
      const totalEstimatedValue = lots.reduce((sum, lot) => {
        return sum + (lot.estimateHigh || lot.estimatedValue || 0)
      }, 0)
      
      await Catalogue.findByIdAndUpdate(
        body.catalogue,
        {
          $set: {
            'metadata.totalLots': lots.length,
            'metadata.estimatedValue': totalEstimatedValue
          }
        }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Lot created successfully',
      lot: newLot
    }, { status: 201 })
  } catch (error) {
    console.error('Create lot error:', error)
    
    // Handle duplicate lot number error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Lot number already exists for this catalogue/auction' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create lot' },
      { status: 500 }
    )
  }
}





