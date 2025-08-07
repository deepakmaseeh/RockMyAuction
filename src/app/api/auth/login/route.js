// FIXED /src/app/api/auth/login/route.js
// FIXED to match the request structure from your Postman
export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📥 Received request body:', body);

    // Handle both local format {email, password} and API format {type, email, password}
    const { email, password, type } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          // Add CORS headers if needed for local testing
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // FIXED: Updated test credentials to match your UI
    if (email === "test@example.com" && password === "test123") {
      const response = {
        success: true,
        token: "demo_token_12345",
        user: {
          id: "1",
          name: "Test User",
          email: email,
          role: "buyer"
        }
      };

      return new Response(JSON.stringify(response), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid credentials" }), { 
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Login route error:', error);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}