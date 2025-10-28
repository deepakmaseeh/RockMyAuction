// src/app/api/search/route.js
// CORRECTED - FORCES EMOJI FORMATTING

async function searchWithGoogle(query) {
  const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
  const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) return [];

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=10`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Google Search error:', error);
    return [];
  }
}

async function searchWithTavily(query, searchDepth = "basic") {
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
  if (!TAVILY_API_KEY) return null;

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: searchDepth,
        include_images: true,
        include_answer: true,
        max_results: 10
      })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Tavily error:', error);
    return null;
  }
}

// THIS IS THE CRITICAL FUNCTION - IT MUST GENERATE EMOJI SECTIONS
async function generateSmartResponse(query, context) {
  const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!GROQ_API_KEY) throw new Error('Groq API key not configured');

  // MOST IMPORTANT: This system prompt FORCES emoji formatting
  const systemPrompt = `You are a helpful search assistant like Perplexity AI.

ABSOLUTELY REQUIRED - YOU MUST FOLLOW THIS FORMAT EXACTLY:

1. Start with ONE brief overview paragraph (2-3 sentences explaining the topic)
2. Add emoji section headers: ✅, 🕰️, 🛍️, 🎯, 📦, 💡, 📝, ⚡
3. Add bullet points under each section
4. End with a follow-up question

EXACT EXAMPLE FORMAT TO COPY:

[Overview paragraph]

✅ Key Points to Know
• Point 1
• Point 2
• Point 3

🛍️ Products/Options Available
• Product 1 details
• Product 2 details

🎯 My Recommendation
• Recommendation 1
• Recommendation 2

[Follow-up question]

CRITICAL: Every section MUST have an emoji header. Use ✅, 🛍️, 🎯 for main sections.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Query: "${query}"\n\nSearch Results:\n${context}\n\nYou MUST use emoji headers (✅, 🛍️, 🎯) in your response. Never skip the emoji headers.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // DEBUG: Log if emojis are present
    const hasEmojis = /[✅🕰️🛍️🎯📦⚡💡📝⚖️❌]/.test(content);
    console.log(`✅ AI Response generated. Has emoji headers: ${hasEmojis}`);
    
    return content;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { query, searchType = 'normal' } = await request.json();
    
    if (!query) {
      return Response.json({ 
        success: false, 
        error: 'Query is required' 
      }, { status: 400 });
    }

    console.log(`🔍 Searching: "${query}"`);

    // Search with both engines
    let searchResults = [];
    let tavilyData = null;
    
    try {
      const [googleResults, tavilyResults] = await Promise.all([
        searchWithGoogle(query),
        searchWithTavily(query, searchType === 'deep' ? 'advanced' : 'basic')
      ]);

      searchResults = [
        ...googleResults.map(r => ({
          title: r.title,
          url: r.link,
          snippet: r.snippet,
          source: 'Google'
        })),
        ...(tavilyResults?.results || []).map(r => ({
          title: r.title,
          url: r.url,
          snippet: r.content,
          source: 'Tavily'
        }))
      ];

      tavilyData = tavilyResults;

      console.log(`✅ Found ${searchResults.length} results`);
    } catch (searchError) {
      console.error('Search error:', searchError);
      return Response.json({ 
        success: false, 
        error: 'Search engines unavailable'
      }, { status: 503 });
    }

    if (searchResults.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No search results found' 
      }, { status: 404 });
    }

    // Create context
    const context = searchResults.slice(0, 10).map((r, i) => 
      `[${i + 1}] ${r.title}\n${r.snippet}\nURL: ${r.url}`
    ).join('\n\n');

    // Generate response WITH emoji formatting
    let aiResponse;
    try {
      aiResponse = await generateSmartResponse(query, context);
    } catch (aiError) {
      console.error('AI error:', aiError);
      return Response.json({ 
        success: false, 
        error: 'AI generation failed'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      response: aiResponse,
      searchResults: searchResults,
      sourceAttribution: `${searchResults.length} results from Google + Tavily`,
      images: tavilyData?.images || []
    });

  } catch (error) {
    console.error('❌ API error:', error);
    return Response.json({ 
      success: false, 
      error: error.message || 'Internal error' 
    }, { status: 500 });
  }
}