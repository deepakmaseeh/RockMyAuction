import { lotController } from '@/backend/controllers/lotController'
import { NextResponse } from 'next/server'

// GET all lots
export async function GET(req) {
  return lotController.getAll(req)
}

// POST create new lot
export async function POST(req) {
  return lotController.create(req)
}





