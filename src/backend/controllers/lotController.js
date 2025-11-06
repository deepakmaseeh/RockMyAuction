/**
 * Lot Controller
 * Handles all lot-related business logic
 */

import { connectDB } from '@/lib/db'
import Lot from '@/lib/models/Lot'
import Catalogue from '@/lib/models/Catalogue'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { lotValidations } from '../utils/validators'
import { handleError, successResponse, getPaginationParams } from '../utils/helpers'

export const lotController = {
  /**
   * Get all lots
   */
  async getAll(req) {
    try {
      await connectDB()
      
      const { searchParams } = new URL(req.url)
      const catalogueId = searchParams.get('catalogue')
      const auctionId = searchParams.get('auction')
      const status = searchParams.get('status')
      const category = searchParams.get('category')
      const { page, limit, skip } = getPaginationParams(req)
      
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
        .skip(skip)
      
      const total = await Lot.countDocuments(query)
      
      return successResponse({
        lots,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      return handleError(error, 'Failed to fetch lots')
    }
  },

  /**
   * Create a new lot
   */
  async create(req) {
    try {
      await connectDB()
      const body = await req.json()

      // Validate lot number
      const lotNumberValidation = lotValidations.validateLotNumber(body.lotNumber)
      if (!lotNumberValidation.valid) {
        return NextResponse.json(
          { success: false, error: lotNumberValidation.error },
          { status: 400 }
        )
      }

      // Validate title
      const titleValidation = lotValidations.validateTitle(body.title)
      if (!titleValidation.valid) {
        return NextResponse.json(
          { success: false, error: titleValidation.error },
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
      const statusValidation = lotValidations.validateStatus(body.status)
      if (!statusValidation.valid) {
        return NextResponse.json(
          { success: false, error: statusValidation.error },
          { status: 400 }
        )
      }

      // Validate condition if provided
      if (body.condition) {
        const conditionValidation = lotValidations.validateCondition(body.condition)
        if (!conditionValidation.valid) {
          return NextResponse.json(
            { success: false, error: conditionValidation.error },
            { status: 400 }
          )
        }
      }

      // Validate pricing
      const pricingValidation = lotValidations.validatePricing(
        body.estimateLow,
        body.estimateHigh,
        body.startingBid,
        body.reservePrice
      )
      if (!pricingValidation.valid) {
        return NextResponse.json(
          { success: false, error: pricingValidation.error },
          { status: 400 }
        )
      }

      const { estimateLow, estimateHigh, startingBid, reservePrice } = pricingValidation.values

      // Validate and convert createdBy to ObjectId or null
      let createdBy = null
      if (body.createdBy) {
        // Check if it's a valid ObjectId format
        if (mongoose.Types.ObjectId.isValid(body.createdBy)) {
          createdBy = body.createdBy
        } else {
          // If not a valid ObjectId, set to null (for demo/test users)
          console.log(`Invalid ObjectId for createdBy: ${body.createdBy}, setting to null`)
          createdBy = null
        }
      }

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
        status: body.status || 'draft',
        featured: body.featured === true,
        seoSlug: body.seoSlug?.trim() || '',
        videoUrl: body.videoUrl?.trim() || '',
        createdBy: createdBy,
        metadata: body.metadata || {},
        // Legacy fields
        estimatedValue: estimateHigh,
        startingPrice: startingBid
      })

      await newLot.save()

      // Update catalogue metadata if catalogue provided
      if (body.catalogue) {
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
      
      return successResponse(
        { lot: newLot },
        'Lot created successfully',
        201
      )
    } catch (error) {
      return handleError(error, 'Failed to create lot')
    }
  }
}

