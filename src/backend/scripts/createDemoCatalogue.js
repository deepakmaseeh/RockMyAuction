/**
 * Demo Catalogue Creation Script
 * Tests the catalogue creation flow and creates a demo catalogue
 */

import { connectDB } from '@/lib/db'
import Catalogue from '@/lib/models/Catalogue'

async function createDemoCatalogue() {
  try {
    console.log('🔌 Connecting to database...')
    await connectDB()
    
    // Check if demo catalogue already exists
    const existingDemo = await Catalogue.findOne({ title: 'Demo Fine Art Auction Catalogue' })
    if (existingDemo) {
      console.log('✅ Demo catalogue already exists!')
      console.log('📋 Catalogue ID:', existingDemo._id)
      console.log('📋 Title:', existingDemo.title)
      return existingDemo
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

    console.log('📝 Creating demo catalogue...')
    const demoCatalogue = new Catalogue(demoCatalogueData)
    await demoCatalogue.save()

    console.log('✅ Demo catalogue created successfully!')
    console.log('📋 Catalogue ID:', demoCatalogue._id)
    console.log('📋 Title:', demoCatalogue.title)
    console.log('📋 Status:', demoCatalogue.status)
    console.log('📋 Auction Date:', demoCatalogue.auctionDate)
    console.log('📋 Location:', demoCatalogue.location)
    
    return demoCatalogue
  } catch (error) {
    console.error('❌ Error creating demo catalogue:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDemoCatalogue()
    .then(() => {
      console.log('✅ Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Script failed:', error)
      process.exit(1)
    })
}

export default createDemoCatalogue





