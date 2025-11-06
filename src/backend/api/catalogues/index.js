import { connectDB } from '@/lib/db'
import Catalogue from '@/lib/models/Catalogue'
import Lot from '@/lib/models/Lot'
import { NextResponse } from 'next/server'

/**
 * Get all catalogues with optional filtering
 */
export async function getAllCatalogues(req) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const createdBy = searchParams.get('createdBy')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const query = {}
    if (status) query.status = status
    if (createdBy) query.createdBy = createdBy
    
    const catalogues = await Catalogue.find(query)
      .populate('createdBy', 'name email')
      .populate('lots')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
    
    const total = await Catalogue.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      catalogues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get catalogues error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch catalogues' },
      { status: 500 }
    )
  }
}

/**
 * Create a new catalogue
 */
export async function createCatalogue(req) {
  try {
    await connectDB()
    const body = await req.json()

    // Validation
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!body.auctionDate) {
      return NextResponse.json(
        { success: false, error: 'Auction date is required' },
        { status: 400 }
      )
    }

    // Validate date
    const auctionDate = new Date(body.auctionDate)
    if (isNaN(auctionDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid auction date format' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['draft', 'published', 'archived']
    const status = body.status || 'draft'
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Use provided createdBy or allow null for demo purposes
    const createdBy = body.createdBy || null

    const newCatalogue = new Catalogue({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      coverImage: body.coverImage || '',
      auctionDate: auctionDate,
      location: body.location?.trim() || '',
      status: status,
      createdBy: createdBy,
      lots: [],
      metadata: {
        totalLots: 0,
        estimatedValue: 0
      }
    })

    await newCatalogue.save()
    
    return NextResponse.json({
      success: true,
      message: 'Catalogue created successfully',
      catalogue: newCatalogue
    }, { status: 201 })
  } catch (error) {
    console.error('Create catalogue error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create catalogue' },
      { status: 500 }
    )
  }
}





