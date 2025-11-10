import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// POST /api/ai/generateLotDraft - Generate lot description using AI
export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrls, title, description, category } = body;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image URL is required' },
        { status: 400 }
      );
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Build prompt
    const prompt = `You are an expert auction catalog writer. Analyze the provided image(s) of an auction item and generate a comprehensive catalog entry.

${title ? `Current title: ${title}` : ''}
${category ? `Category: ${category}` : ''}
${description ? `Existing description: ${description}` : ''}

Please provide a structured JSON response with the following fields:
{
  "title": "A concise, descriptive title (max 80 characters)",
  "subtitle": "A brief subtitle or tagline (optional)",
  "attributes": {
    "maker": "Artist/maker name if visible",
    "model": "Model or type",
    "material": "Primary materials",
    "era": "Time period or era",
    "dimensions": "Dimensions if visible (format: 'H x W x D cm')",
    "condition": "Brief condition assessment",
    "provenance": "Any visible provenance indicators",
    "signature": "Signature or markings if visible"
  },
  "description": "A detailed 3-5 paragraph description covering:\n- Key features and characteristics\n- Condition assessment\n- Historical context if applicable\n- Notable details\n- Any visible wear or damage",
  "conditionReport": "Detailed condition report",
  "estimateLow": estimated_low_value_in_usd,
  "estimateHigh": estimated_high_value_in_usd,
  "estimateRationale": "Brief explanation of estimate range",
  "category": "Most appropriate category",
  "tags": ["tag1", "tag2", "tag3"]
}

Important guidelines:
- Use cautious language ("appears to be", "likely", "possibly") for uncertain claims
- Never guarantee authenticity unless explicitly verified
- Be objective about condition
- Include all visible details
- Keep descriptions professional and auction-appropriate

Return ONLY valid JSON, no markdown formatting.`;

    // Process images (first image for now - Gemini Vision can handle multiple)
    const imageData = imageUrls[0]; // Base64 or URL
    
    // Call Gemini Vision API
    let result;
    try {
      result = await model.generateContent([
        prompt,
        { inlineData: { data: imageData.split(',')[1] || imageData, mimeType: 'image/jpeg' } }
      ]);
    } catch (error) {
      // Fallback: use text-only model if vision fails
      const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      result = await textModel.generateContent(
        `${prompt}\n\nNote: Analyze based on the provided context only.`
      );
    }
    
    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    let parsed;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      parsed = JSON.parse(jsonText.trim());
    } catch (parseError) {
      // Fallback: try to extract structured data from text
      parsed = {
        title: title || 'Untitled Item',
        description: text,
        attributes: {},
        estimateLow: 0,
        estimateHigh: 0,
        category: category || 'Uncategorized'
      };
    }
    
    // Validate and sanitize response
    const draft = {
      title: parsed.title?.substring(0, 80) || title || 'Untitled Item',
      subtitle: parsed.subtitle?.substring(0, 200) || '',
      description: parsed.description || text || '',
      conditionReport: parsed.conditionReport || '',
      attributes: parsed.attributes || {},
      estimateLow: Math.max(0, parseInt(parsed.estimateLow) || 0),
      estimateHigh: Math.max(0, parseInt(parsed.estimateHigh) || 0),
      estimateRationale: parsed.estimateRationale || '',
      category: parsed.category || category || 'Uncategorized',
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 10) : []
    };
    
    // Ensure estimateHigh >= estimateLow
    if (draft.estimateHigh < draft.estimateLow) {
      draft.estimateHigh = draft.estimateLow;
    }
    
    return NextResponse.json({
      success: true,
      draft
    });
  } catch (error) {
    console.error('Error generating lot draft:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate draft' },
      { status: 500 }
    );
  }
}






