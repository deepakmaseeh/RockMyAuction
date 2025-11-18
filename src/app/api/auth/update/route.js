import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// PUT /api/auth/update - Update user profile (Protected - Proxy to backend)
export async function PUT(req) {
  try {
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
    
    const url = `${BACKEND_URL}/api/auth/update`;
    console.log('📤 Proxying PUT /api/auth/update to backend');
    
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
      const errorData = await response.json().catch(() => ({ message: 'Failed to update profile' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to update profile' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying PUT /api/auth/update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

