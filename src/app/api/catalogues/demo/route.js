/**
 * API Route to create a demo catalogue
 * POST /api/catalogues/demo
 */

import { connectDB } from '@/lib/db'
import Catalogue from '@/lib/models/Catalogue'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectDB()
    
    // Check if demo catalogue already exists
    const existingDemo = await Catalogue.findOne({ title: 'Demo Fine Art Auction Catalogue' })
    if (existingDemo) {
      return NextResponse.json({
        success: true,
        message: 'Demo catalogue already exists',
        catalogue: existingDemo
      }, { status: 200 })
    }

    // Create demo catalogue data
    const demoCatalogueData = {
      title: 'Demo Fine Art Auction Catalogue',
      description: 'A curated collection of fine art pieces including paintings, sculptures, and contemporary works from renowned artists. This catalogue features exceptional pieces that showcase the best of modern and classical art.',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      auctionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      location: 'New York, NY - Christie\'s Auction House',
      status: 'published',
      createdBy: null, // Demo user - no valid ObjectId
      lots: [],
      metadata: {
        totalLots: 0,
        estimatedValue: 0
      }
    }

    const demoCatalogue = new Catalogue(demoCatalogueData)
    await demoCatalogue.save()

    return NextResponse.json({
      success: true,
      message: 'Demo catalogue created successfully',
      catalogue: demoCatalogue
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating demo catalogue:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create demo catalogue' 
      },
      { status: 500 }
    )
  }
}


