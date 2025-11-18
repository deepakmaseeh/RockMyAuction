import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// GET /api/auctions/[id] - Get single auction (Proxy to backend)
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const url = `${BACKEND_URL}/api/auctions/${id}`;
    console.log('📥 GET /api/auctions/[id] - Proxying to backend:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Auction not found' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Auction not found' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying GET /api/auctions/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

// PUT /api/auctions/[id] - Update auction (Protected - Proxy to backend)
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Get auth token from Authorization header or cookies
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
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const url = `${BACKEND_URL}/api/auctions/${id}`;
    console.log('📤 Proxying PUT /api/auctions/[id] to backend:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: tokenToSend,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update auction' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to update auction' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying PUT /api/auctions/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

// DELETE /api/auctions/[id] - Delete auction (Protected - Proxy to backend)
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    // Get auth token from Authorization header or cookies
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
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const url = `${BACKEND_URL}/api/auctions/${id}`;
    console.log('📤 Proxying DELETE /api/auctions/[id] to backend:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: tokenToSend,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete auction' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to delete auction' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying DELETE /api/auctions/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}
