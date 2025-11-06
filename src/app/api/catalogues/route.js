import { catalogueController } from '@/backend/controllers/catalogueController'
import { NextResponse } from 'next/server'

// GET all catalogues
export async function GET(req) {
  try {
    return await catalogueController.getAll(req)
  } catch (error) {
    console.error('Catalogue API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch catalogues' },
      { status: 500 }
    )
  }
}

// POST create new catalogue
export async function POST(req) {
  try {
    return await catalogueController.create(req)
  } catch (error) {
    console.error('Catalogue API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create catalogue' },
      { status: 500 }
    )
  }
}

