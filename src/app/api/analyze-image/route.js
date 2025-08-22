import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. /api/analyze-image will fail.')
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

export async function POST(request) {
  try {
    if (!genAI) {
      return NextResponse.json({ success: false, error: 'Server misconfigured: missing GEMINI_API_KEY' }, { status: 500 })
    }

    const { imageUrl, imageKey } = await request.json()

    if (!imageUrl || !(imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return NextResponse.json({ success: false, error: 'imageUrl is required and must be http(s)' }, { status: 400 })
    }

    // Fetch image and convert to base64 for inlineData
    const res = await fetch(imageUrl)
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch image (${res.status})` }, { status: 400 })
    }

    // Cap extremely large files (basic safeguard)
    const contentLength = Number(res.headers.get('content-length') || 0)
    const MAX_BYTES = 10 * 1024 * 1024 // 10MB
    if (contentLength && contentLength > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'Image too large (>10MB)' }, { status: 400 })
    }

    const contentTypeHeader = res.headers.get('content-type') || ''
    // Fallback to jpeg if unknown
    const mimeType = contentTypeHeader.startsWith('image/') ? contentTypeHeader : 'image/jpeg'

    const arrayBuf = await res.arrayBuffer()
    const base64 = Buffer.from(arrayBuf).toString('base64')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Analyze this auction item image and respond ONLY with a valid JSON object:
{
  "title": "Compelling title (<= 60 chars)",
  "description": "Detailed description (<= 300 chars)",
  "category": "One of: Electronics, Art & Collectibles, Jewelry & Watches, Antiques & Vintage, Fashion & Accessories, Home & Garden, Sports & Recreation, Books & Media, Toys & Games, Musical Instruments, Photography Equipment, Automotive Parts, Memorabilia, Furniture, Tools & Equipment",
  "condition": "New | Like New | Good | Fair | Poor",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "suggestedStartingBid": "numeric string like 25 or 25.00",
  "estimatedValue": "range string like $50-100 or $120"
}
Do not include markdown fences. Ensure strict JSON.`

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64,
        }
      }
    ])

    const text = result?.response?.text?.() || ''

    // Strip markdown fences if any, then parse
    const cleaned = text.replace(/``````/g, '').trim()
    let analysis
    try {
      analysis = JSON.parse(cleaned)
    } catch (e) {
      // Attempt to salvage: find first {...} block
      const match = cleaned.match(/\{[\s\S]*\}/)
      if (match) {
        analysis = JSON.parse(match[0])
      } else {
        throw new Error('AI did not return valid JSON')
      }
    }

    // Minimal normalization
    if (analysis?.suggestedStartingBid) {
      analysis.suggestedStartingBid = String(analysis.suggestedStartingBid).replace(/[^\d.]/g, '')
    }
    if (!Array.isArray(analysis?.keyFeatures)) {
      analysis.keyFeatures = []
    }

    return NextResponse.json({ success: true, analysis: { ...analysis, imageKey: imageKey || null } })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to analyze image' }, { status: 500 })
  }
}
