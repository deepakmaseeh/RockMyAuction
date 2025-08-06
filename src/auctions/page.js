// import Navbar from '../../components/Navbar'
// import Footer from '../../components/Footer'
// import AuctionCard from '../../components/AuctionCard'

// const liveAuctions = [
//   {
//     slug: 'rolex-daytona-paul-newman',
//     image: '/img1.jpg',
//     title: 'Vintage Rolex Daytona "Paul Newman"',
//     currentBid: 250000,
//     endTime: "3h 46m left",
//     users: 19,
//   },
//   {
//     slug: 'kaws-companion-flayed',
//     image: '/img2.jpg',
//     title: 'KAWS Companion (Flayed) Limit...',
//     currentBid: 55000,
//     endTime: "2h 31m left",
//     users: 34,
//   },
//   {
//     slug: 'air-jordan-1-og-chicago',
//     image: '/img3.jpg',
//     title: 'Air Jordan 1 Retro High OG "Chicago"',
//     currentBid: 18100,
//     endTime: "1h 25m left",
//     users: 42,
//   },
//   // Add more auctions as desired, matching your design
// ]

// export default function LiveAuctionsPage() {
//   return (
//     <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
//       <Navbar />

//       <main className="flex-1 max-w-6xl mx-auto px-6 py-12">
//         <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {liveAuctions.map((auction, idx) => (
//             <AuctionCard key={auction.slug} {...auction} />
//           ))}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuctions } from '@/hooks/useAPI'
import { auctionAPI } from '@/lib/api'

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  )
}

// Error Component
function ErrorMessage({ error, onRetry }) {
  return (
    <div className="text-center p-8">
      <div className="text-red-400 mb-4">Error: {error}</div>
      <button 
        onClick={onRetry}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
      >
        Retry
      </button>
    </div>
  )
}

// Auction Card Component
function AuctionCard({ auction }) {
  const timeLeft = auction.endTime ? new Date(auction.endTime) - new Date() : 0
  const isEnded = timeLeft <= 0

  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return 'ENDED'
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all overflow-hidden">
      <div className="relative">
        <img
          src={auction.images?.[0] || '/placeholder-auction.jpg'}
          alt={auction.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            isEnded ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {isEnded ? 'ENDED' : 'LIVE'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
          {auction.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Current Bid</span>
          <span className="font-bold text-orange-400">
            ${auction.currentBid?.toLocaleString() || auction.startingBid?.toLocaleString() || '0'}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">{auction.bids || 0} bids</span>
          <span className="text-sm font-medium text-white">
            {formatTimeLeft(timeLeft)}
          </span>
        </div>

        <Link
          href={`/auctions/${auction._id || auction.id}`}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition text-center block"
        >
          {isEnded ? 'View Results' : 'Place Bid'}
        </Link>
      </div>
    </div>
  )
}

export default function AuctionsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'active',
    sortBy: 'ending_soon',
    search: ''
  })

  const { data: auctions, loading, error, refetch } = useAuctions(filters)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <img src="/rock_my_auction_logo.png" alt="Rock My Auction" className="h-8 w-auto" />
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search auctions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            />
            
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="art">Art & Collectibles</option>
              <option value="fashion">Fashion</option>
              <option value="jewelry">Jewelry & Watches</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="active">Active Auctions</option>
              <option value="ended">Ended Auctions</option>
              <option value="all">All Auctions</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="ending_soon">Ending Soon</option>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Auctions Grid */}
        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        
        {auctions && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🏺</div>
                <h3 className="text-2xl font-bold mb-2">No auctions found</h3>
                <p className="text-gray-400">Try adjusting your search filters</p>
              </div>
            ) : (
              auctions.map((auction) => (
                <AuctionCard key={auction._id || auction.id} auction={auction} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
