import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request) {
  try {
    // Try to parse as formData first (this is what we want for file uploads)
    // Next.js formData() will handle multipart/form-data even if Content-Type header 
    // doesn't explicitly include the boundary
    let formData;
    let file;
    
    try {
      formData = await request.formData();
      file = formData.get('image');
    } catch (formDataError) {
      // If formData parsing fails, try JSON (for testing with imageUrl)
      try {
        const body = await request.json();
        if (body.imageUrl) {
          // If it's a JSON request with imageUrl, return it directly
          return NextResponse.json({
            success: true,
            publicUrl: body.imageUrl,
            dest: body.imageUrl,
            message: 'Image URL provided'
          });
        }
      } catch (jsonError) {
        // Neither formData nor JSON worked
        const contentType = request.headers.get('content-type') || '';
        console.error('❌ Failed to parse request:', { 
          formDataError: formDataError.message, 
          jsonError: jsonError.message, 
          contentType 
        });
        
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request format. Expected multipart/form-data with image file.',
            message: 'Invalid request format',
            receivedContentType: contentType,
            details: formDataError.message
          },
          { status: 400 }
        );
      }
      
      // If we got here, it's JSON but no imageUrl
      return NextResponse.json(
        {
          success: false,
          error: 'No image file or imageUrl provided',
          message: 'No image file or imageUrl provided'
        },
        { status: 400 }
      );
    }
    
    // Check if file exists
    if (!file || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
          message: 'No file uploaded'
        },
        { status: 400 }
      );
    }

    console.log('📥 POST /api/upload - Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Create FormData for backend
      const backendFormData = new FormData();
      backendFormData.append('image', file);
      // Forward the 'type' parameter if it exists (for folder organization: auctions/ or catalogs/)
      const type = formData.get('type');
      if (type) {
        backendFormData.append('type', type);
      }

    // Get auth token from Authorization header (sent from frontend)
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header received in Next.js route:', {
      hasHeader: !!authHeader,
      headerLength: authHeader ? authHeader.length : 0,
      headerPrefix: authHeader ? authHeader.substring(0, 30) + '...' : 'none',
      allHeaders: Object.fromEntries(request.headers.entries())
    });

    // Also try to get from cookies as fallback (not common, but just in case)
    let authToken = null;
    try {
      const cookieStore = await cookies();
      authToken = cookieStore.get('auth-token')?.value;
      console.log('🍪 Auth token from cookies:', !!authToken);
    } catch (e) {
      // Cookies might not be available in Next.js API routes for client-side requests
      console.log('⚠️ Could not read cookies (this is normal):', e.message);
    }

    const url = `${BACKEND_URL}/api/upload`;

    // Use Authorization header from request if available, otherwise use cookie
    // Note: authHeader should already include "Bearer " prefix from frontend
    const tokenToSend = authHeader || (authToken ? `Bearer ${authToken}` : null);
    
    if (!tokenToSend) {
      console.error('❌ No auth token found in upload request!');
      console.error('   - Authorization header:', authHeader);
      console.error('   - Cookie token:', authToken);
      console.error('   - All request headers:', Object.fromEntries(request.headers.entries()));
      console.error('   - Request method:', request.method);
      console.error('   - Request URL:', request.url);
      
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please login and try again.',
          message: 'Not authorized, token missing',
          help: 'Please ensure you are logged in and the auth token is being sent in the Authorization header.',
          debug: {
            hasAuthHeader: !!authHeader,
            hasCookieToken: !!authToken,
            authHeaderValue: authHeader ? authHeader.substring(0, 30) + '...' : null,
            headers: Object.fromEntries(request.headers.entries())
          }
        },
        { status: 401 }
      );
    }
    
    console.log('✅ Auth token found and will be forwarded to backend:', {
      hasToken: !!tokenToSend,
      tokenLength: tokenToSend.length,
      tokenPrefix: tokenToSend.substring(0, 30) + '...'
    });
    
    console.log('📤 Forwarding upload to backend:', {
      url,
      hasToken: !!tokenToSend,
      tokenLength: tokenToSend.length,
      tokenPrefix: tokenToSend.substring(0, 30) + '...',
      tokenFormat: tokenToSend.startsWith('Bearer ') ? 'Bearer token ✓' : 'Plain token (may be invalid)'
    });

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          // Don't set Content-Type - let fetch set it with boundary for multipart/form-data
          ...(tokenToSend && { 'Authorization': tokenToSend }),
        },
        body: backendFormData,
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
      const errorMessage = data.message || data.error || 'Failed to upload image';
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          message: errorMessage,
          details: data
        },
        { status: response.status }
      );
    }

    console.log('✅ Backend success response:', data);

    if (data.success && data.publicUrl) {
      return NextResponse.json({
        success: true,
        publicUrl: data.publicUrl,
        dest: data.dest,
        message: data.message || 'Image uploaded successfully'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Error in POST /api/upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload image',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

