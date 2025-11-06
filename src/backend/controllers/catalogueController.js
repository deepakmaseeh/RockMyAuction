/**
 * Catalogue Controller
 * Handles all catalogue-related business logic
 */

import { connectDB } from '@/lib/db'
import Catalogue from '@/lib/models/Catalogue'
import Lot from '@/lib/models/Lot'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { catalogueValidations } from '../utils/validators'
import { handleError, successResponse, getPaginationParams } from '../utils/helpers'

export const catalogueController = {
  /**
   * Get all catalogues
   */
  async getAll(req) {
    try {
      console.log('Connecting to database...')
      await connectDB()
      
      const { searchParams } = new URL(req.url)
      const status = searchParams.get('status')
      const createdBy = searchParams.get('createdBy')
      const { page, limit, skip } = getPaginationParams(req)
      
      const query = {}
      if (status) query.status = status
      if (createdBy) query.createdBy = createdBy
      
      console.log('Fetching catalogues with query:', query)
      const catalogues = await Catalogue.find(query)
        .populate('createdBy', 'name email')
        .populate('lots')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
      
      const total = await Catalogue.countDocuments(query)
      
      console.log(`Found ${catalogues.length} catalogues`)
      
      return successResponse({
        catalogues,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      console.error('Error in catalogueController.getAll:', error)
      return handleError(error, 'Failed to fetch catalogues')
    }
  },

  /**
   * Create a new catalogue
   */
  async create(req) {
    try {
      await connectDB()
      const body = await req.json()

      // Validate title
      const titleValidation = catalogueValidations.validateTitle(body.title)
      if (!titleValidation.valid) {
        return NextResponse.json(
          { success: false, error: titleValidation.error },
          { status: 400 }
        )
      }

      // Validate auction date
      const dateValidation = catalogueValidations.validateAuctionDate(body.auctionDate)
      if (!dateValidation.valid) {
        return NextResponse.json(
          { success: false, error: dateValidation.error },
          { status: 400 }
        )
      }

      // Validate status
      const statusValidation = catalogueValidations.validateStatus(body.status)
      if (!statusValidation.valid) {
        return NextResponse.json(
          { success: false, error: statusValidation.error },
          { status: 400 }
        )
      }

      // Validate and convert createdBy to ObjectId or omit if invalid
      const catalogueData = {
        title: body.title.trim(),
        description: body.description?.trim() || '',
        coverImage: body.coverImage || '',
        auctionDate: new Date(body.auctionDate),
        location: body.location?.trim() || '',
        status: body.status || 'draft',
        lots: [],
        metadata: {
          totalLots: 0,
          estimatedValue: 0
        }
      }

      // Only add createdBy if it's a valid ObjectId, otherwise explicitly set to null
      if (body.createdBy && mongoose.Types.ObjectId.isValid(body.createdBy)) {
        catalogueData.createdBy = body.createdBy
      } else {
        // Explicitly set to null to avoid casting errors
        catalogueData.createdBy = null
        if (body.createdBy) {
          console.log(`Invalid ObjectId for createdBy: ${body.createdBy}, setting to null`)
        }
      }

      const newCatalogue = new Catalogue(catalogueData)

      await newCatalogue.save()
      
      return successResponse(
        { catalogue: newCatalogue },
        'Catalogue created successfully',
        201
      )
    } catch (error) {
      return handleError(error, 'Failed to create catalogue')
    }
  }
}

