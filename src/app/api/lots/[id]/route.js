import { connectDB } from '@/lib/db'
import Lot from '@/lib/models/Lot'
import Catalogue from '@/lib/models/Catalogue'
import { NextResponse } from 'next/server'

// GET single lot by ID
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    
    const lot = await Lot.findById(id)
      .populate('catalogue', 'title auctionDate location')
      .populate('createdBy', 'name email')
    
    if (!lot) {
      return NextResponse.json(
        { success: false, error: 'Lot not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      lot
    })
  } catch (error) {
    console.error('Get lot error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lot' },
      { status: 500 }
    )
  }
}

// PUT update lot
export async function PUT(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const updateData = {}
    if (body.lotNumber) updateData.lotNumber = body.lotNumber
    if (body.title) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.images) updateData.images = body.images
    if (body.category) updateData.category = body.category
    if (body.condition) updateData.condition = body.condition
    if (body.estimatedValue !== undefined) updateData.estimatedValue = body.estimatedValue
    if (body.startingPrice !== undefined) updateData.startingPrice = body.startingPrice
    if (body.reservePrice !== undefined) updateData.reservePrice = body.reservePrice
    if (body.provenance !== undefined) updateData.provenance = body.provenance
    if (body.dimensions) updateData.dimensions = body.dimensions
    if (body.weight) updateData.weight = body.weight
    if (body.status) updateData.status = body.status
    if (body.metadata) updateData.metadata = body.metadata

    const lot = await Lot.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('catalogue').populate('createdBy', 'name email')

    if (!lot) {
      return NextResponse.json(
        { success: false, error: 'Lot not found' },
        { status: 404 }
      )
    }

    // Update catalogue metadata if estimated value changed
    if (body.estimatedValue !== undefined) {
      const lots = await Lot.find({ catalogue: lot.catalogue._id })
      const totalEstimatedValue = lots.reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
      await Catalogue.findByIdAndUpdate(
        lot.catalogue._id,
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
      message: 'Lot updated successfully',
      lot
    })
  } catch (error) {
    console.error('Update lot error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update lot' },
      { status: 500 }
    )
  }
}

// DELETE lot
export async function DELETE(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    
    const lot = await Lot.findById(id)
    if (!lot) {
      return NextResponse.json(
        { success: false, error: 'Lot not found' },
        { status: 404 }
      )
    }

    const catalogueId = lot.catalogue

    // Remove lot from catalogue
    await Catalogue.findByIdAndUpdate(
      catalogueId,
      { $pull: { lots: id } }
    )

    // Recalculate catalogue metadata
    const lots = await Lot.find({ catalogue: catalogueId })
    const totalEstimatedValue = lots.reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
    await Catalogue.findByIdAndUpdate(
      catalogueId,
      {
        $set: {
          'metadata.totalLots': lots.length,
          'metadata.estimatedValue': totalEstimatedValue
        }
      }
    )

    await Lot.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Lot deleted successfully'
    })
  } catch (error) {
    console.error('Delete lot error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete lot' },
      { status: 500 }
    )
  }
}


