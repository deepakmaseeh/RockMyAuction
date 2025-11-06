import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables')
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

export async function POST(request) {
  try {
    console.log('🤖 Form Image Analysis API called')

    if (!genAI) {
      console.error('❌ Gemini AI not initialized - missing API key')
      return NextResponse.json({ 
        success: false, 
        error: 'AI service not configured. Please check GEMINI_API_KEY.' 
      }, { status: 500 })
    }

    const { imageBase64, formType = 'auto', imageUrl } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ 
        success: false, 
        error: 'imageBase64 is required' 
      }, { status: 400 })
    }

    // Determine form type based on URL or explicit parameter
    const isCatalogue = formType === 'catalogue'
    const isLot = formType === 'lot'
    const isAuction = formType === 'auction'
    const isSupport = formType === 'support'

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const mimeType = imageBase64.match(/data:image\/(\w+);base64/)?.[1] || 'jpeg'

    console.log('🔄 Calling Gemini AI for form analysis...')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Different prompts for different form types
    let prompt = ''
    
    if (isCatalogue) {
      // Catalogue form prompt
      prompt = `You are an expert auction cataloguer. Analyze this image and extract catalogue information.

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
{
  "title": "Descriptive catalogue title (max 80 characters)",
  "description": "Detailed catalogue description (2-4 sentences about the auction theme and items)",
  "location": "City, State/Country format",
  "category": "Main category if identifiable",
  "suggestedDate": "YYYY-MM-DD format (suggest appropriate auction date)"
}

Rules:
- Title should be descriptive and appealing
- Description should explain what type of items/auction this is
- Location should be a real place if visible, otherwise suggest a major city
- If no date visible, suggest a date 2-4 weeks from now
- NO markdown formatting, NO code blocks, JUST the JSON object`
    } else if (isAuction) {
      // Auction form prompt (similar to lot but for auction listing)
      prompt = `You are an expert auction appraiser. Analyze this image and extract auction listing details.

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
{
  "title": "Descriptive item title (max 80 characters)",
  "description": "Detailed description (3-5 sentences about the item, its features, condition, and history)",
  "category": "EXACTLY one of: Electronics, Art & Collectibles, Jewelry & Watches, Antiques & Vintage, Fashion & Accessories, Home & Garden, Sports & Recreation, Books & Media, Toys & Games, Musical Instruments, Photography Equipment, Automotive Parts, Memorabilia, Furniture, Tools & Equipment",
  "startingPrice": 0,
  "reservePrice": 0
}

Rules:
- Use ONLY the exact categories listed above
- Estimate realistic starting price based on visible item
- Reserve price should be 85-90% of starting price
- NO markdown formatting, NO code blocks, JUST the JSON object`
    } else if (isSupport) {
      // Support form prompt
      prompt = `You are analyzing an image to help generate a support request. Extract relevant information.

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
{
  "category": "EXACTLY one of: billing, technical, account, auction, other",
  "subject": "Brief subject line describing the issue (max 50 characters)",
  "message": "Detailed description of the issue or question (3-5 sentences)"
}

Rules:
- Use ONLY the exact categories listed above
- Subject should be clear and concise
- Message should describe the issue or question
- NO markdown formatting, NO code blocks, JUST the JSON object`
    } else {
      // Lot form prompt (default)
      prompt = `You are an expert auction appraiser. Analyze this image and extract lot/item details.

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
{
  "title": "Descriptive item title (max 80 characters)",
  "description": "Detailed description (3-5 sentences about the item, its features, condition, and history)",
  "category": "EXACTLY one of: Electronics, Art & Collectibles, Jewelry & Watches, Antiques & Vintage, Fashion & Accessories, Home & Garden, Sports & Recreation, Books & Media, Toys & Games, Musical Instruments, Photography Equipment, Automotive Parts, Memorabilia, Furniture, Tools & Equipment",
  "condition": "EXACTLY one of: excellent, very-good, good, fair, poor",
  "estimatedValue": 0,
  "startingPrice": 0,
  "reservePrice": 0,
  "provenance": "Item history/origin if visible or inferable",
  "dimensions": {
    "height": 0,
    "width": 0,
    "depth": 0,
    "unit": "cm"
  },
  "weight": {
    "value": 0,
    "unit": "kg"
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- Use ONLY the exact categories listed above
- Use ONLY the exact condition options listed above
- Estimate value based on visible item (be realistic)
- Starting price should be 70-80% of estimated value
- Reserve price should be 85-90% of estimated value
- If dimensions/weight not visible, use 0
- Extract 3-5 relevant tags
- NO markdown formatting, NO code blocks, JUST the JSON object`
    }

    try {
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: `image/${mimeType}`,
            data: base64Data,
          }
        }
      ])

      const responseText = result?.response?.text() || ''
      console.log('🤖 Raw AI response:', responseText.substring(0, 200))

      if (!responseText) {
        throw new Error('Empty response from AI')
      }

      // Clean and parse JSON
      let cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^\s*{/, '{')
        .replace(/}\s*$/, '}')
        .trim()

      // Try to extract JSON if wrapped in text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanedText = jsonMatch[0]
      }

      let analysis
      try {
        analysis = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        console.error('❌ Cleaned text:', cleanedText.substring(0, 300))
        throw new Error(`AI returned invalid JSON: ${cleanedText.substring(0, 200)}...`)
      }

      // Validate and clean data
      if (isCatalogue) {
        // Catalogue-specific validation
        if (!analysis.title) analysis.title = 'Fine Art & Collectibles Auction'
        if (!analysis.description) analysis.description = 'A curated collection of fine items for auction'
        if (!analysis.location) analysis.location = 'New York, NY'
        if (!analysis.suggestedDate) {
          const date = new Date()
          date.setDate(date.getDate() + 21) // 3 weeks from now
          analysis.suggestedDate = date.toISOString().split('T')[0]
        }
      } else if (isAuction) {
        // Auction-specific validation
        const validCategories = [
          "Electronics", "Art & Collectibles", "Jewelry & Watches", 
          "Antiques & Vintage", "Fashion & Accessories", "Home & Garden",
          "Sports & Recreation", "Books & Media", "Toys & Games",
          "Musical Instruments", "Photography Equipment", "Automotive Parts",
          "Memorabilia", "Furniture", "Tools & Equipment"
        ]
        
        if (!analysis.title) analysis.title = 'Auction Item'
        if (!analysis.description) analysis.description = 'Fine item for auction'
        if (!validCategories.includes(analysis.category)) analysis.category = 'Memorabilia'
        analysis.startingPrice = Math.max(0, parseFloat(analysis.startingPrice) || 0)
        analysis.reservePrice = Math.max(0, parseFloat(analysis.reservePrice) || Math.round(analysis.startingPrice * 0.9))
      } else if (isSupport) {
        // Support-specific validation
        const validCategories = ['billing', 'technical', 'account', 'auction', 'other']
        if (!validCategories.includes(analysis.category)) analysis.category = 'technical'
        if (!analysis.subject) analysis.subject = 'Support Request'
        if (!analysis.message) analysis.message = 'I need assistance with this issue.'
      } else {
        // Lot-specific validation
        const validCategories = [
          "Electronics", "Art & Collectibles", "Jewelry & Watches", 
          "Antiques & Vintage", "Fashion & Accessories", "Home & Garden",
          "Sports & Recreation", "Books & Media", "Toys & Games",
          "Musical Instruments", "Photography Equipment", "Automotive Parts",
          "Memorabilia", "Furniture", "Tools & Equipment"
        ]
        const validConditions = ["excellent", "very-good", "good", "fair", "poor"]

        if (!analysis.title) analysis.title = 'Auction Item'
        if (!analysis.description) analysis.description = 'Fine item for auction'
        if (!validCategories.includes(analysis.category)) analysis.category = 'Memorabilia'
        if (!validConditions.includes(analysis.condition)) analysis.condition = 'good'
        
        // Ensure numbers are valid
        analysis.estimatedValue = Math.max(0, parseFloat(analysis.estimatedValue) || 0)
        analysis.startingPrice = Math.max(0, parseFloat(analysis.startingPrice) || Math.round(analysis.estimatedValue * 0.75))
        analysis.reservePrice = Math.max(0, parseFloat(analysis.reservePrice) || Math.round(analysis.estimatedValue * 0.85))
        
        // Ensure dimensions/weight are objects
        if (!analysis.dimensions) analysis.dimensions = { height: 0, width: 0, depth: 0, unit: 'cm' }
        if (!analysis.weight) analysis.weight = { value: 0, unit: 'kg' }
        if (!analysis.tags || !Array.isArray(analysis.tags)) analysis.tags = []
      }

      console.log('✅ AI analysis completed:', analysis)

      // Include image URL/data URL for form fields
      if (imageUrl) {
        if (isCatalogue) {
          analysis.coverImage = imageUrl
        } else if (isAuction || isSupport) {
          analysis.imageUrl = imageUrl
        } else {
          analysis.images = [imageUrl]
        }
      } else {
        // Use base64 data URL for form fields
        if (isCatalogue) {
          analysis.coverImage = imageBase64 // Full base64 data URL
        } else if (isAuction || isSupport) {
          analysis.imageUrl = imageBase64 // Full base64 data URL
        } else {
          analysis.images = [imageBase64] // Full base64 data URL
        }
      }

      return NextResponse.json({ 
        success: true, 
        formType: isCatalogue ? 'catalogue' : isLot ? 'lot' : isAuction ? 'auction' : isSupport ? 'support' : 'lot',
        data: analysis
      })

    } catch (aiError) {
      console.error('❌ Gemini AI error:', aiError)
      return NextResponse.json({ 
        success: false, 
        error: `AI analysis failed: ${aiError.message}` 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Unexpected error in form image analysis:', error)
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${error.message}` 
    }, { status: 500 })
  }
}
