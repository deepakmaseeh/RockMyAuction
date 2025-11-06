import { connectDB } from '@/lib/db'
import Catalogue from '@/lib/models/Catalogue'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

// GET single catalogue by ID
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    
    const catalogue = await Catalogue.findById(id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'lots',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      })
    
    if (!catalogue) {
      return NextResponse.json(
        { success: false, error: 'Catalogue not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      catalogue
    })
  } catch (error) {
    console.error('Get catalogue error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch catalogue' },
      { status: 500 }
    )
  }
}

// PUT update catalogue
export async function PUT(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const updateData = {}
    if (body.title) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage
    if (body.auctionDate) updateData.auctionDate = new Date(body.auctionDate)
    if (body.location !== undefined) updateData.location = body.location
    if (body.status) updateData.status = body.status
    
    // Handle createdBy - validate ObjectId or set to null
    if (body.createdBy !== undefined) {
      if (body.createdBy && mongoose.Types.ObjectId.isValid(body.createdBy)) {
        updateData.createdBy = body.createdBy
      } else {
        updateData.createdBy = null
      }
    }

    const catalogue = await Catalogue.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').populate('lots')

    if (!catalogue) {
      return NextResponse.json(
        { success: false, error: 'Catalogue not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Catalogue updated successfully',
      catalogue
    })
  } catch (error) {
    console.error('Update catalogue error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update catalogue' },
      { status: 500 }
    )
  }
}

// DELETE catalogue
export async function DELETE(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    
    const catalogue = await Catalogue.findById(id)
    if (!catalogue) {
      return NextResponse.json(
        { success: false, error: 'Catalogue not found' },
        { status: 404 }
      )
    }

    // Delete all lots associated with this catalogue
    const Lot = (await import('@/lib/models/Lot')).default
    await Lot.deleteMany({ catalogue: id })

    await Catalogue.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Catalogue deleted successfully'
    })
  } catch (error) {
    console.error('Delete catalogue error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete catalogue' },
      { status: 500 }
    )
  }
}

