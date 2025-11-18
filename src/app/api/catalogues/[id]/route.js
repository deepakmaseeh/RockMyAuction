import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// GET /api/catalogues/:id - Proxy to backend
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const url = `${BACKEND_URL}/api/catalogues/${id}`;
    
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
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch catalogue' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch catalogue' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Transform backend response to frontend format
    if (data.success && data.data) {
      return NextResponse.json({
        success: true,
        catalogue: data.data,
      });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch catalogue' },
      { status: 500 }
    );
  }
}

// PUT /api/catalogues/:id - Proxy to backend
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Get auth token from cookies or headers
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/api/catalogues/${id}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update catalogue' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to update catalogue' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update catalogue' },
      { status: 500 }
    );
  }
}

// DELETE /api/catalogues/:id - Proxy to backend
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Get auth token from cookies or headers
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/api/catalogues/${id}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...(authHeader && { 'Authorization': authHeader }),
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete catalogue' }));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to delete catalogue' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete catalogue' },
      { status: 500 }
    );
  }
}

