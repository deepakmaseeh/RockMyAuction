import { auctionController } from '@/backend/controllers/auctionController'
import { NextResponse } from 'next/server'

// GET active auctions only
export async function GET(req) {
  return auctionController.getActive(req)
}






