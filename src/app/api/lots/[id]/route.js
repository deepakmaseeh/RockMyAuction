import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('📥 GET /api/lots/[id] - Fetching lot:', { id });

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');

    const url = `${BACKEND_URL}/api/lots/${id}`;

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
      const errorMessage = data.message || data.error || 'Failed to fetch lot';
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
    console.error('❌ Error in GET /api/lots/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch lot',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log('📥 PUT /api/lots/[id] - Updating lot:', { id, body });

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
      status: body.status,
      tags: body.metadata?.tags || body.tags,
      notes: body.metadata?.notes || body.notes,
      metadata: body.metadata,
    };

    console.log('📤 Sending to backend:', { url: `${BACKEND_URL}/api/lots/${id}`, body: backendBody });

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');

    const url = `${BACKEND_URL}/api/lots/${id}`;

    let response;
    try {
      response = await fetch(url, {
        method: 'PUT',
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
      const errorMessage = data.message || data.error || 'Failed to update lot';
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
    console.error('❌ Error in PUT /api/lots/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update lot',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log('📥 DELETE /api/lots/[id] - Deleting lot:', { id });

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');

    const url = `${BACKEND_URL}/api/lots/${id}`;

    let response;
    try {
      response = await fetch(url, {
        method: 'DELETE',
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
      const errorMessage = data.message || data.error || 'Failed to delete lot';
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

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Error in DELETE /api/lots/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete lot',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

