import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// POST /api/auth - Proxy to backend for login/register
export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📥 POST /api/auth - Request received:', {
      type: body.type,
      email: body.email,
    });
    
    const url = `${BACKEND_URL}/api/auth`;
    console.log('📤 Proxying to backend:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
      console.error('❌ Backend auth error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Authentication failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Auth successful:', {
      hasToken: !!data.token,
      hasUser: !!data.user,
      userEmail: data.user?.email,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying POST /api/auth:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

// GET /api/auth - Proxy to backend auth root
export async function GET(req) {
  try {
    const url = `${BACKEND_URL}/api/auth`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to reach auth endpoint' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying GET /api/auth:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 503 }
    );
  }
}

