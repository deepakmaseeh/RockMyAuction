import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// GET /api/catalogues - Proxy to backend
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api/catalogues${queryString ? `?${queryString}` : ''}`;
    
    // Get auth token from cookies or headers
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...(authHeader && { 'Authorization': authHeader }),
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch catalogues' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch catalogues' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Transform backend response to frontend format
    if (data.success && Array.isArray(data.data)) {
      return NextResponse.json({
        success: true,
        catalogues: data.data,
        pagination: data.pagination,
      });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch catalogues' },
      { status: 500 }
    );
  }
}

// POST /api/catalogues - Proxy to backend
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📥 Received POST request to /api/catalogues:', { body });
    
    // Transform frontend format to backend format
    const backendBody = {
      title: body.title,
      description: body.description,
      slug: body.slug, // Will be auto-generated if not provided
      startAt: body.startAt || body.auctionDate,
      endAt: body.endAt,
      buyerPremiumPct: body.buyerPremiumPct || 0,
      termsHtml: body.termsHtml || '',
      status: body.status || 'draft',
      createdBy: body.createdBy, // For demo purposes
    };
    
    console.log('📤 Sending to backend:', { url: `${BACKEND_URL}/api/catalogues`, body: backendBody });
    
    // Get auth token from cookies or headers
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/api/catalogues`;
    
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: JSON.stringify(backendBody),
        cache: 'no-store',
      });
    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to connect to backend at ${BACKEND_URL}. Make sure the backend server is running.`,
          details: fetchError.message 
        },
        { status: 503 }
      );
    }
    
    console.log('📡 Backend response status:', response.status, response.statusText);
    
    let data;
    try {
      const responseText = await response.text();
      console.log('📡 Backend response text:', responseText.substring(0, 500));
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse backend response:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid response from backend server',
          details: parseError.message 
        },
        { status: 500 }
      );
    }
    
    if (!response.ok) {
      console.error('❌ Backend error response:', data);
      // Handle both error formats: { message: "..." } and { error: "..." }
      const errorMessage = data.message || data.error || 'Failed to create catalogue';
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          message: errorMessage, // Also include as message for consistency
          details: data 
        },
        { status: response.status }
      );
    }
    
    console.log('✅ Backend success response:', data);
    
    // Transform backend response to frontend format
    if (data.success && data.data) {
      return NextResponse.json({
        success: true,
        catalogue: data.data,
      });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Error in POST /api/catalogues:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create catalogue',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

