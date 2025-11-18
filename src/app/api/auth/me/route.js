import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// GET /api/auth/me - Get current logged-in user (Protected)
export async function GET(req) {
  try {
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
    
    const url = `${BACKEND_URL}/api/auth/me`;
    console.log('📤 Proxying GET /api/auth/me to backend');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: tokenToSend,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to get profile' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to get profile' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying GET /api/auth/me:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

