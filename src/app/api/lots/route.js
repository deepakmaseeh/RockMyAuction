import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogId = searchParams.get('catalogId');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';
    const search = searchParams.get('search');
    
    let url = `${BACKEND_URL}/api/lots`;
    const params = new URLSearchParams({ page, limit });
    if (catalogId) params.append('catalogId', catalogId);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    console.log('📥 GET /api/lots - Fetching lots:', { url });

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');

    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...(authHeader && { 'Authorization': authHeader }),
        },
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
      const errorMessage = data.message || data.error || 'Failed to fetch lots';
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

    // Transform response for frontend
    if (data.success && data.data) {
      const lots = Array.isArray(data.data) ? data.data : [];
      return NextResponse.json({
        success: true,
        lots,
        data: lots,
        pagination: data.pagination || {},
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Error in GET /api/lots:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch lots',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📥 Received POST request to /api/lots:', { body });

    // Map frontend fields to backend fields
    const backendBody = {
      lotNumber: body.lotNumber,
      title: body.title,
      description: body.description,
      images: body.images || [],
      category: body.category,
      condition: body.condition,
      estimatedValue: body.estimatedValue,
      startingPrice: body.startingPrice,
      reservePrice: body.reservePrice,
      provenance: body.provenance,
      dimensions: body.dimensions,
      weight: body.weight,
      catalogue: body.catalogue || body.catalogId,
      status: body.status || 'draft',
      createdBy: body.createdBy,
      tags: body.metadata?.tags || body.tags,
      notes: body.metadata?.notes || body.notes,
      metadata: body.metadata,
    };

    console.log('📤 Sending to backend:', { url: `${BACKEND_URL}/api/lots`, body: backendBody });

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');

    const url = `${BACKEND_URL}/api/lots`;

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
      const errorMessage = data.message || data.error || 'Failed to create lot';
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

    if (data.success && data.data) {
      return NextResponse.json({
        success: true,
        lot: data.data,
        data: data.data,
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Error in POST /api/lots:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create lot',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

