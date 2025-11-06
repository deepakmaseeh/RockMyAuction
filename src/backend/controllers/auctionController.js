/**
 * Auction Controller
 * Handles all auction-related business logic
 */

import { connectDB } from '@/lib/db'
import Auction from '@/lib/models/Auction'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { auctionValidations } from '../utils/validators'
import { handleError, successResponse, getPaginationParams } from '../utils/helpers'

export const auctionController = {
  /**
   * Get all auctions
   */
  async getAll(req) {
    try {
      await connectDB()
      
      const { searchParams } = new URL(req.url)
      const status = searchParams.get('status')
      const active = searchParams.get('active')
      const category = searchParams.get('category')
      const createdBy = searchParams.get('createdBy')
      const { page, limit, skip } = getPaginationParams(req)
      
      const query = {}
      
      if (status) query.status = status
      
      if (active === 'true') {
        const now = new Date()
        query.endAt = { $gt: now }
        query.status = { $in: ['live', 'scheduled'] }
      }
      
      if (category) query.category = category
      if (createdBy) query.createdById = createdBy
      
      const auctions = await Auction.find(query)
        .populate('createdById', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean()
      
      const total = await Auction.countDocuments(query)
      
      // Enrich with legacy fields
      const enrichedAuctions = auctions.map(auction => ({
        ...auction,
        endDate: auction.endAt,
        endTime: auction.endAt,
        startDate: auction.startAt,
        startTime: auction.startAt,
        createdBy: auction.createdById,
        category: auction.category || '',
        images: auction.images || [],
        currentBid: auction.currentBid || 0,
        reservePrice: auction.reservePrice || null,
        quantity: auction.quantity || 1
      }))
      
      return successResponse({
        auctions: enrichedAuctions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      return handleError(error, 'Failed to fetch auctions')
    }
  },

  /**
   * Create a new auction
   */
  async create(req) {
    try {
      await connectDB()
      const body = await req.json()

      // Validate title
      const titleValidation = auctionValidations.validateTitle(body.title)
      if (!titleValidation.valid) {
        return NextResponse.json(
          { success: false, error: titleValidation.error },
          { status: 400 }
        )
      }

      // Validate dates
      const datesValidation = auctionValidations.validateDates(body.startTime, body.endTime, body.endAt)
      if (!datesValidation.valid) {
        return NextResponse.json(
          { success: false, error: datesValidation.error },
          { status: 400 }
        )
      }

      const { startAt, endAt } = datesValidation.values

      // Generate slug
      const slug = await auctionValidations.generateSlug(body.title, Auction)

      // Determine status
      let status = body.status || 'draft'
      if (status === 'draft' && startAt <= new Date() && endAt > new Date()) {
        status = 'live'
      } else if (endAt <= new Date()) {
        status = 'closed'
      }

      // Validate and convert createdById to ObjectId or null
      let createdById = null
      const userIdValue = body.createdById || body.createdBy
      if (userIdValue) {
        // Check if it's a valid ObjectId format
        if (mongoose.Types.ObjectId.isValid(userIdValue)) {
          createdById = userIdValue
        } else {
          // If not a valid ObjectId, set to null (for demo/test users)
          console.log(`Invalid ObjectId for createdById: ${userIdValue}, setting to null`)
          createdById = null
        }
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
        createdById: createdById
      })

      await newAuction.save()
      
      // Return with legacy fields
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
      
      return successResponse(
        { auction: auctionResponse },
        'Auction created successfully',
        201
      )
    } catch (error) {
      return handleError(error, 'Failed to create auction')
    }
  },

  /**
   * Get active auctions
   */
  async getActive(req) {
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
      
      if (category) query.category = category
      
      const auctions = await Auction.find(query)
        .populate('createdById', 'name email')
        .sort({ endAt: 1 })
        .limit(limit)
        .lean()
      
      // Enrich with legacy fields
      const enrichedAuctions = auctions.map(auction => ({
        ...auction,
        endDate: auction.endAt,
        endTime: auction.endAt,
        startDate: auction.startAt,
        startTime: auction.startAt,
        createdBy: auction.createdById,
        category: auction.category || '',
        images: auction.images || [],
        currentBid: auction.currentBid || 0,
        reservePrice: auction.reservePrice || null,
        quantity: auction.quantity || 1
      }))
      
      return successResponse({
        auctions: enrichedAuctions,
        count: enrichedAuctions.length
      })
    } catch (error) {
      return handleError(error, 'Failed to fetch active auctions')
    }
  }
}

