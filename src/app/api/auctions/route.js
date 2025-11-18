import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// GET all auctions - Proxy to backend
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    
    const url = `${BACKEND_URL}/api/auctions${queryString ? `?${queryString}` : ''}`;
    console.log('📥 GET /api/auctions - Proxying to backend:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch auctions' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch auctions' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying GET /api/auctions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

// POST create new auction - Proxy to backend
export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📥 POST /api/auctions - Request received:', {
      title: body.title,
      hasImageUrl: !!body.imageUrl,
      imageUrl: body.imageUrl ? body.imageUrl.substring(0, 50) + '...' : null,
    });
    
    // Get auth token from cookies or Authorization header
    const authHeader = req.headers.get('authorization');
    let authToken = null;
    try {
      const cookieStore = await cookies();
      authToken = cookieStore.get('auth-token')?.value;
    } catch (e) {
      // Cookies might not be available
    }
    
    const tokenToSend = authHeader || (authToken ? `Bearer ${authToken}` : null);
    
    if (!tokenToSend) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please login and try again.' },
        { status: 401 }
      );
    }
    
    const url = `${BACKEND_URL}/api/auctions`;
    console.log('📤 Proxying to backend:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: tokenToSend,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create auction' }));
      console.error('❌ Backend error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to create auction' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Auction created successfully:', {
      id: data._id || data.id,
      title: data.title,
      hasImageUrl: !!data.imageUrl,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying POST /api/auctions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}








