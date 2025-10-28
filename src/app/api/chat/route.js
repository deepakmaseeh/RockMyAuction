// src/app/api/chat/route.js
// Enhanced with Response Length Control (Chat=Short, Search=Detailed)

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_CHAIN = [
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
];

// SHORT responses for chat mode (100-200 words)
const CHAT_SYSTEM_PROMPT = `You are a helpful auction assistant for RockMyAuction.

CRITICAL RULES:
1. Keep responses SHORT (100-200 words maximum)
2. Be conversational and friendly
3. Use bullet points for lists
4. Answer directly and concisely
5. If analyzing products, provide brief overview only

For product images in CHAT mode:
• Quick identification (item type, brand)
• Estimated value range
• Brief condition note
• One key recommendation

Example chat response:
"This is a Rolex Submariner from the 1980s.

• Estimated value: $10,000-$12,000
• Condition: Good with minor wear
• Market demand: High
• Recommendation: Clean and service before auction

Would you like detailed market analysis?"`;

// DETAILED responses for search mode (Multiple sections + citations)
const SEARCH_SYSTEM_PROMPT = `You are an expert auction analyst for RockMyAuction.

CRITICAL RULES:
1. Provide DETAILED, comprehensive analysis
2. Use structured sections with emoji headers
3. Include specific data and numbers
4. Use bullet points throughout
5. Be thorough and professional

When analyzing products, structure response EXACTLY like this:

## 📦 ITEM IDENTIFICATION
• Type: [Specific category]
• Brand: [Brand name]
• Model: [Model/variant]
• Condition: [Excellent/Good/Fair/Poor]

## 💰 PRICING & VALUE
• Current Market: $[low] - $[high]
• Estimated Auction: $[price]
• Price Trend: [Increasing/Stable/Decreasing]
• Condition Factor: [adjustment percentage]

## 📋 SPECIFICATIONS
• Material: [materials]
• Size/Dimensions: [measurements]
• Year/Era: [when produced]
• Rarity: [Common/Uncommon/Rare]
• Key Features: [list 5-7 features]

## 🔍 CONDITION REPORT
• Physical: [wear, damage, cosmetic state]
• Functional: [does it work?]
• Authenticity: [genuine/replica indicators]
• Grade: [A/B/C/D rating]

## 📊 MARKET ANALYSIS
• Demand: [High/Medium/Low]
• Target Buyers: [who buys this]
• Competition: [market availability]
• Best Season: [when to sell]

## 💡 RECOMMENDATIONS
• Starting Price: $[amount]
• Best Platform: [where to sell]
• Time to Sell: [expected duration]
• Marketing Tips: [how to attract buyers]

## ⚠️ IMPORTANT NOTES
• Risks: [any issues to watch for]
• Care: [maintenance needed]

Be comprehensive and data-driven. Provide specific numbers and facts.`;

async function compressImage(base64String, maxSizeMB = 10) {
  try {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const sizeInBytes = (base64Data.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB <= maxSizeMB) return base64Data;
    
    console.log(`⚠️ Image ${sizeInMB.toFixed(2)}MB, compressing...`);
    return base64Data;
  } catch (error) {
    throw new Error('Image too large. Please use under 10MB.');
  }
}

async function generateWithFallback(modelName, contents, history, systemPrompt, maxTokens) {
  for (const model of MODEL_CHAIN) {
    try {
      console.log(`🤖 Trying ${model}`);
      
      const currentModel = genAI.getGenerativeModel({ 
        model: model,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: maxTokens,
        }
      });

      let result;
      
      if (history && history.length > 0) {
        const chat = currentModel.startChat({ history });
        result = await chat.sendMessage(contents);
      } else {
        result = await currentModel.generateContent(contents);
      }

      console.log(`✅ Success with ${model}`);
      return { result, modelUsed: model };
      
    } catch (error) {
      console.error(`❌ ${model} failed:`, error.message);
      
      if (error.message?.includes('overloaded') || 
          error.message?.includes('503') || 
          error.message?.includes('quota')) {
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('All models unavailable');
}

async function generateWithSearch(query, image, systemPrompt) {
  for (const model of MODEL_CHAIN) {
    try {
      const currentModel = genAI.getGenerativeModel({ 
        model: model,
        tools: [{ googleSearch: {} }],
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096,
        }
      });

      let contents = [{ text: query }];
      
      if (image) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: image
          }
        });
      }

      const result = await currentModel.generateContent(contents);
      return { result, modelUsed: model };
      
    } catch (error) {
      if (error.message?.includes('overloaded') || 
          error.message?.includes('503') || 
          error.message?.includes('quota')) {
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Search unavailable');
}

export async function POST(request) {
  try {
    const { message, image, mode = 'chat', history = [] } = await request.json();
    
    if (!message && !image) {
      return Response.json({ 
        success: false, 
        error: 'Message or image required' 
      }, { status: 400 });
    }

    console.log(`\n🚀 ${mode} mode: "${message?.substring(0, 30)}..."`);

    let processedImage = null;
    if (image) {
      processedImage = await compressImage(image, 10);
    }

    // Select system prompt and max tokens based on mode
    const isSearchMode = mode === 'search' || mode === 'deep_search';
    const systemPrompt = isSearchMode ? SEARCH_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;
    const maxTokens = isSearchMode ? 4096 : 512; // Chat=short, Search=detailed

    let result, modelUsed;

    if (isSearchMode) {
      const searchQuery = image 
        ? `${message || 'Analyze this product for auction'}\n\nProvide comprehensive analysis with all sections.`
        : message;
      
      const { result: searchResult, modelUsed: model } = await generateWithSearch(
        searchQuery, 
        processedImage,
        systemPrompt
      );
      result = searchResult;
      modelUsed = model;
    } else {
      // Chat mode - use last 10 messages for context
      const validHistory = [];
      
      if (history && history.length > 0) {
        const recentHistory = history.slice(-10); // Last 10 messages only
        
        for (const msg of recentHistory) {
          if (msg.text && msg.text.trim()) {
            validHistory.push({
              role: msg.role === 'bot' ? 'model' : 'user',
              parts: [{ text: msg.text }]
            });
          }
        }
        
        while (validHistory.length > 0 && validHistory[0].role === 'model') {
          validHistory.shift();
        }
      }

      let contents = [];
      
      if (message) {
        const enhancedMessage = image 
          ? `${message}\n\nProvide brief product overview (100-200 words).`
          : message;
        contents.push({ text: enhancedMessage });
      }
      
      if (processedImage) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: processedImage
          }
        });
      }

      const { result: chatResult, modelUsed: model } = await generateWithFallback(
        MODEL_CHAIN[0], 
        contents, 
        validHistory,
        systemPrompt,
        maxTokens
      );
      result = chatResult;
      modelUsed = model;
    }

    const response = result.response;
    const text = response.text();

    let groundingMetadata = null;
    let citations = [];
    
    if (isSearchMode) {
      if (response.candidates?.[0]?.groundingMetadata) {
        groundingMetadata = response.candidates[0].groundingMetadata;
        
        if (groundingMetadata.groundingChunks) {
          citations = groundingMetadata.groundingChunks
            .filter(chunk => chunk.web)
            .map(chunk => ({
              title: chunk.web.title || 'Web Source',
              url: chunk.web.uri,
              snippet: chunk.web.snippet || ''
            }));
        }
      }
    }

    console.log(`✅ ${text.length} chars, ${citations.length} citations\n`);

    return Response.json({
      success: true,
      response: text,
      citations: citations,
      hasGrounding: groundingMetadata !== null,
      metadata: {
        model: modelUsed,
        mode: mode,
        wordCount: text.split(' ').length,
        grounded: groundingMetadata !== null,
        imageProcessed: !!processedImage
      }
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    
    let errorMessage = 'Something went wrong. Please try again.';
    let statusCode = 500;
    
    if (error.message?.includes('API_KEY')) {
      errorMessage = 'API key error. Check configuration.';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'Rate limit reached. Please wait.';
      statusCode = 429;
    } else if (error.message?.includes('overloaded')) {
      errorMessage = 'Service busy. Try again in a moment.';
      statusCode = 503;
    } else if (error.message?.includes('Image too large')) {
      errorMessage = error.message;
      statusCode = 400;
    } else {
      errorMessage = error.message || errorMessage;
    }

    return Response.json({ 
      success: false, 
      error: errorMessage
    }, { status: statusCode });
  }
}
