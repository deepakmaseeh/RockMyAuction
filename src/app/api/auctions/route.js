import { auctionController } from '@/backend/controllers/auctionController'
import { NextResponse } from 'next/server'

// GET all auctions
export async function GET(req) {
  return auctionController.getAll(req)
}

// POST create new auction
export async function POST(req) {
  return auctionController.create(req)
}





