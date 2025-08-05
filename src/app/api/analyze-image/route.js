import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const auctionCategories = [
  "Electronics",
  "Art & Collectibles", 
  "Jewelry & Watches",
  "Antiques & Vintage",
  "Fashion & Accessories",
  "Home & Garden",
  "SportsToys & Games",
  "Musical Instruments",
  "Photography Equipment",
  "Automotive Parts",
  "Memorabilia",
  "Furniture",
  "Tools & Equipment"
]

export async function POST(request) {
  try {
    // Use native FormData parsing - NO MULTER NEEDED
    const formData = await request.formData()
    const file = formData.get('image')
    
    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'No valid image file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Optimize image using sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Convert to base64 for OpenAI API
    const base64Image = optimizedBuffer.toString('base64')

    // Create AI prompt for auction item analysis
    const prompt = `Analyze this auction item image and provide the following information in JSON format:

    {
      "title": "A compelling, descriptive title for this auction item (max 60 characters)",
      "category": "Choose the most appropriate category from: ${auctionCategories.join(', ')}",
      "description": "A detailed, professional auction description highlighting key features, condition, materials, brand, age/era, and unique selling points (150-300 words)",
      "estimatedValue": "Provide a rough market value range in USD (e.g., '$100-200' or '$500-1000')",
      "condition": "Estimate condition: Excellent, Very Good, Good, Fair, or Poor",
      "keyFeatures": ["List 3-5 key features or selling points as an array"],
      "suggestedStartingBid": "Suggest a reasonable starting bid amount in USD"
    }

    Focus on auction-specific details that would help buyers make informed decisions. Be accurate and professional.`

    // Call OpenAI Vision API with proper error handling
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using cost-effective vision model
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })

    // Parse the AI response
    const aiContent = response.choices[0].message.content
    
    let analysisResult
    try {
      // Extract JSON from response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error('JSON parsing failed:', parseError)
      analysisResult = {
        title: "Auction Item - Please Add Title",
        category: "Art & Collectibles",
        description: "Please add a description for this auction item.",
        estimatedValue: "To be determined",
        condition: "Good",
        keyFeatures: ["Unique item", "Good condition"],
        suggestedStartingBid: "$10"
      }
    }

    return NextResponse.json({ 
      success: true, 
      analysis: analysisResult,
      usage: response.usage
    })

  } catch (error) {
    console.error('AI Analysis Error:', error)
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing.' },
        { status: 429 }
      )
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your configuration.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}

// Important: Remove the multer config entirely
// export const config = {
//   api: {
//     bodyParser: false, // NOT NEEDED with native FormData
//   },
// }
