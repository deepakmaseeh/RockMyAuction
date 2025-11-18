import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables')
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

export async function POST(request) {
  try {
    console.log('🤖 AI Analysis API called')

    if (!genAI) {
      console.error('❌ Gemini AI not initialized - missing API key')
      return NextResponse.json({ 
        success: false, 
        error: 'AI service not configured. Please check GEMINI_API_KEY.' 
      }, { status: 500 })
    }

    let requestData
    try {
      requestData = await request.json()
      console.log('📊 Received request data:', requestData)
    } catch (e) {
      console.error('❌ Invalid JSON in request:', e)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }, { status: 400 })
    }

    const { imageUrl, imageKey } = requestData

    // Validate imageUrl
    if (!imageUrl) {
      console.error('❌ Missing imageUrl in request')
      return NextResponse.json({ 
        success: false, 
        error: 'imageUrl is required' 
      }, { status: 400 })
    }

    if (typeof imageUrl !== 'string' || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
      console.error('❌ Invalid imageUrl format:', imageUrl)
      return NextResponse.json({ 
        success: false, 
        error: 'imageUrl must be a valid http(s) URL' 
      }, { status: 400 })
    }

    console.log('📥 Fetching image from:', imageUrl)

    // Fetch image with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    let imageResponse
    try {
      imageResponse = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'RockMyAuction-AI-Analyzer/1.0'
        }
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('❌ Failed to fetch image:', fetchError)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ 
          success: false, 
          error: 'Image fetch timeout (30s). Please ensure the image is publicly accessible.' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `Failed to fetch image: ${fetchError.message}. Make sure the Google Cloud Storage bucket is publicly readable.` 
      }, { status: 400 })
    }

    if (!imageResponse.ok) {
      console.error('❌ Image fetch failed:', imageResponse.status, imageResponse.statusText)
      return NextResponse.json({ 
        success: false, 
        error: `Image not accessible (${imageResponse.status}: ${imageResponse.statusText}). Check Google Cloud Storage bucket permissions.` 
      }, { status: 400 })
    }

    // Check content type
    const contentType = imageResponse.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      console.error('❌ Invalid content type:', contentType)
      return NextResponse.json({ 
        success: false, 
        error: `Invalid content type: ${contentType}. Expected image/*` 
      }, { status: 400 })
    }

    // Check file size
    const contentLength = Number(imageResponse.headers.get('content-length') || 0)
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (contentLength > MAX_SIZE) {
      console.error('❌ Image too large:', contentLength, 'bytes')
      return NextResponse.json({ 
        success: false, 
        error: `Image too large (${Math.round(contentLength / 1024 / 1024)}MB). Max 10MB allowed.` 
      }, { status: 400 })
    }

    console.log('✅ Image fetched successfully:', {
      contentType,
      size: contentLength ? `${Math.round(contentLength / 1024)}KB` : 'unknown'
    })

    // Convert to base64
    const arrayBuffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    console.log('🔄 Calling Gemini AI...')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert auction appraiser. Analyze this image and provide auction details.

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
{
  "title": "Compelling auction title (max 60 characters)",
  "description": "Detailed description for bidders (max 300 characters)", 
  "category": "EXACTLY one of: Electronics, Art & Collectibles, Jewelry & Watches, Antiques & Vintage, Fashion & Accessories, Home & Garden, Sports & Recreation, Books & Media, Toys & Games, Musical Instruments, Photography Equipment, Automotive Parts, Memorabilia, Furniture, Tools & Equipment",
  "condition": "EXACTLY one of: New, Like New, Good, Fair, Poor",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "suggestedStartingBid": "25",
  "estimatedValue": "$50-100"
}

Rules:
- Use ONLY the exact categories listed above
- Use ONLY the exact condition options listed above
- Keep keyFeatures to 3-5 items max
- Make suggestedStartingBid a plain number (no $ symbol)
- Make estimatedValue a range with $ symbol
- NO markdown formatting, NO code blocks, JUST the JSON object`

    try {
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: contentType,
            data: base64,
          }
        }
      ])

      const responseText = result?.response?.text?.() || ''
      console.log('🤖 Raw AI response:', responseText)

      if (!responseText) {
        throw new Error('Empty response from AI')
      }

      // Clean and parse JSON
      const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      let analysis
      try {
        analysis = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        console.error('❌ Raw text was:', cleanedText)
        
        // Try to extract JSON from the response
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            analysis = JSON.parse(jsonMatch[0])
          } catch (e) {
            throw new Error(`AI returned invalid JSON: ${cleanedText.substring(0, 200)}...`)
          }
        } else {
          throw new Error(`AI response is not JSON: ${cleanedText.substring(0, 200)}...`)
        }
      }

      // Validate and provide defaults for required fields
      const requiredFields = ['title', 'description', 'category', 'condition']
      for (const field of requiredFields) {
        if (!analysis[field]) {
          analysis[field] = field === 'title' ? 'Auction Item' : 
                          field === 'description' ? 'Item for auction' :
                          field === 'category' ? 'Memorabilia' : 'Good'
        }
      }

      // Clean and validate data
      if (analysis.keyFeatures && !Array.isArray(analysis.keyFeatures)) {
        analysis.keyFeatures = []
      }

      if (analysis.suggestedStartingBid) {
        analysis.suggestedStartingBid = String(analysis.suggestedStartingBid).replace(/[^\d.]/g, '') || '25'
      } else {
        analysis.suggestedStartingBid = '25'
      }

      if (!analysis.estimatedValue) {
        analysis.estimatedValue = '$50-100'
      }

      console.log('✅ AI analysis completed:', analysis)

      return NextResponse.json({ 
        success: true, 
        analysis: {
          ...analysis,
          imageKey: imageKey || null 
        }
      })

    } catch (aiError) {
      console.error('❌ Gemini AI error:', aiError)
      return NextResponse.json({ 
        success: false, 
        error: `AI analysis failed: ${aiError.message}` 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Unexpected error in AI analysis:', error)
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${error.message}` 
    }, { status: 500 })
  }
}
