'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

// Mock bid history data
const mockBidHistory = [
  {
    id: 1,
    auctionId: 101,
    title: "Vintage 1962 Fender Stratocaster",
    image: "/auctions/guitar.jpg",
    seller: "VintageGuitars",
    category: "Musical Instruments",
    bidAmount: 15200,
    bidTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    currentBid: 15500,
    status: "OUTBID", // WINNING, OUTBID, WON, LOST
    auctionStatus: "LIVE",
    timeLeft: "2h 15m",
    totalBids: 156,
    myBidCount: 8,
    maxBid: 16000, // Auto-bid maximum
    isAutoBid: true
  },
  {
    id: 2,
    auctionId: 102,
    title: "Rare Baseball Card Collection Mickey Mantle",
    image: "/auctions/baseball.jpg",
    seller: "SportsCardsDepot",
    category: "Sports Cards",
    bidAmount: 4200,
    bidTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    currentBid: 4200,
    status: "WINNING",
    auctionStatus: "LIVE",
    timeLeft: "4h 30m",
    totalBids: 89,
    myBidCount: 5,
    maxBid: null,
    isAutoBid: false
  },
  {
    id: 3,
    auctionId: 103,
    title: "Abstract Art Sculpture by Arya",
    image: "/auctions/sculpture.jpg",
    seller: "ModernArtStudy",
    category: "Sculpture",
    bidAmount: 2650,
    bidTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    currentBid: 2800,
    status: "OUTBID",
    auctionStatus: "LIVE",
    timeLeft: "1d 3h",
    totalBids: 34,
    myBidCount: 3,
    maxBid: 3000,
    isAutoBid: true
  },
  {
    id: 4,
    auctionId: 104,
    title: "Vintage Rolex Datejust 1971",
    image: "/auctions/watch1.jpg",
    seller: "LuxuryTimepieces",
    category: "Watches",
    bidAmount: 2400,
    bidTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    currentBid: 2550,
    status: "WON",
    auctionStatus: "ENDED",
    timeLeft: "ENDED",
    totalBids: 45,
    myBidCount: 12,
    maxBid: null,
    isAutoBid: false,
    finalPrice: 2400,
    wonAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
  },
  {
    id: 5,
    auctionId: 105,
    title: "KAWS Companion Limited Edition Figure",
    image: "/auctions/kaws.jpg",
    seller: "ArtCollective",
    category: "Art & Collectibles",
    bidAmount: 800,
    bidTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    currentBid: 850,
    status: "LOST",
    auctionStatus: "ENDED",
    timeLeft: "ENDED",
    totalBids: 22,
    myBidCount: 4,
    maxBid: null,
    isAutoBid: false,
    finalPrice: 850
  },
  {
    id: 6,
    auctionId: 106,
    title: "First Edition Harry Potter Book",
    image: "/auctions/book.jpg",
    seller: "RareBooksCollector",
    category: "Books",
    bidAmount: 3200,
    bidTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    currentBid: 3500,
    status: "OUTBID",
    auctionStatus: "LIVE",
    timeLeft: "5d 8h",
    totalBids: 38,
    myBidCount: 6,
    maxBid: 4000,
    isAutoBid: true
  }
]

// Bid History Item Component
function BidHistoryItem({ bid, onRebid, onViewDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'WINNING':
        return 'bg-green-600 text-green-100'
      case 'WON':
        return 'bg-blue-600 text-blue-100'
      case 'OUTBID':
        return 'bg-orange-600 text-orange-100'
      case 'LOST':
        return 'bg-red-600 text-red-100'
      default:
        return 'bg-gray-600 text-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'WINNING':
        return '🏆'
      case 'WON':
        return '✅'
      case 'OUTBID':
        return '⚠️'
      case 'LOST':
        return '❌'
      default:
        return '⏳'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m ago`
    }
  }

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-20 h-20 bg-[#232326] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={bid.image || '/placeholder-auction.jpg'}
              alt={bid.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-lg truncate pr-4">
                {bid.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                  {getStatusIcon(bid.status)} {bid.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <span>by {bid.seller}</span>
              <span>•</span>
              <span>{bid.category}</span>
              <span>•</span>
              <span>Bid {formatTime(bid.bidTime)}</span>
            </div>

            {/* Bid Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400">My Bid</div>
                <div className="font-bold text-white">${bid.bidAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Current Bid</div>
                <div className={`font-bold ${
                  bid.status === 'WINNING' ? 'text-green-400' : 
                  bid.status === 'OUTBID' ? 'text-orange-400' : 'text-white'
                }`}>
                  ${bid.currentBid.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">My Bids</div>
                <div className="font-bold text-blue-400">{bid.myBidCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Time Left</div>
                <div className="font-bold text-white">{bid.timeLeft}</div>
              </div>
            </div>

            {/* Auto-bid Info */}
            {bid.isAutoBid && bid.maxBid && (
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <span>🤖</span>
                  <span>Auto-bidding active up to ${bid.maxBid.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Won/Lost Info */}
            {bid.status === 'WON' && (
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-green-400 text-sm">
                  <span>🎉 Congratulations! You won this auction</span>
                  <span>Final: ${bid.finalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {bid.status === 'LOST' && (
              <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-red-400 text-sm">
                  <span>Auction ended - Better luck next time!</span>
                  <span>Final: ${bid.finalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Total bids: {bid.totalBids} • Auction {bid.auctionStatus.toLowerCase()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onViewDetails(bid.auctionId)}
                  className="px-4 py-2 bg-[#232326] hover:bg-[#2a2a2e] text-gray-300 rounded-lg text-sm font-medium transition"
                >
                  View Details
                </button>
                {(bid.status === 'OUTBID' || bid.status === 'WINNING') && bid.auctionStatus === 'LIVE' && (
                  <button
                    onClick={() => onRebid(bid)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    {bid.status === 'OUTBID' ? 'Rebid' : 'Increase Bid'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Filter Tabs Component
function BidFilterTabs({ activeFilter, setActiveFilter, counts }) {
  const filters = [
    { key: 'all', label: 'All Bids', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'winning', label: 'Winning', count: counts.winning },
    { key: 'won', label: 'Won', count: counts.won },
    { key: 'lost', label: 'Lost', count: counts.lost }
  ]

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] mb-8">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeFilter === filter.key
                ? 'bg-orange-500 text-white'
                : 'bg-[#232326] text-gray-300 hover:bg-[#2a2a2e] hover:text-white'
            }`}
          >
            {filter.label}
            <span className={`text-xs px-2 py-1 rounded-full ${
              activeFilter === filter.key ? 'bg-orange-600' : 'bg-[#333]'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Statistics Cards Component
function BidStatistics({ bids }) {
  const stats = {
    totalBids: bids.reduce((sum, bid) => sum + bid.myBidCount, 0),
    totalSpent: bids.filter(bid => bid.status === 'WON').reduce((sum, bid) => sum + bid.finalPrice, 0),
    successRate: bids.length > 0 ? Math.round((bids.filter(bid => bid.status === 'WON').length / bids.length) * 100) : 0,
    avgBidAmount: bids.length > 0 ? Math.round(bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / bids.length) : 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.totalBids}</div>
          <div className="text-sm text-gray-400">Total Bids Placed</div>
        </div>
      </div>
      <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">${stats.totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Won Value</div>
        </div>
      </div>
      <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.successRate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
      </div>
      <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">${stats.avgBidAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Avg Bid Amount</div>
        </div>
      </div>
    </div>
  )
}

// Main Bid History Page
export default function BidHistoryPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [bidHistory, setBidHistory] = useState(mockBidHistory)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent') // recent, amount, status

  // Filter bids based on active filter
  const filteredBids = bidHistory.filter(bid => {
    const matchesSearch = bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.seller.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    switch (activeFilter) {
      case 'active':
        return bid.auctionStatus === 'LIVE'
      case 'winning':
        return bid.status === 'WINNING'
      case 'won':
        return bid.status === 'WON'
      case 'lost':
        return bid.status === 'LOST'
      default:
        return true
    }
  })

  // Sort bids
  const sortedBids = [...filteredBids].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.bidAmount - a.bidAmount
      case 'status':
        const statusOrder = { 'WINNING': 0, 'OUTBID': 1, 'WON': 2, 'LOST': 3 }
        return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4)
      default: // recent
        return new Date(b.bidTime) - new Date(a.bidTime)
    }
  })

  // Calculate counts for filter tabs
  const counts = {
    all: bidHistory.length,
    active: bidHistory.filter(bid => bid.auctionStatus === 'LIVE').length,
    winning: bidHistory.filter(bid => bid.status === 'WINNING').length,
    won: bidHistory.filter(bid => bid.status === 'WON').length,
    lost: bidHistory.filter(bid => bid.status === 'LOST').length
  }

  // Handle rebid
  const handleRebid = (bid) => {
    router.push(`/auctions/${bid.auctionId}`)
  }

  // Handle view details
  const handleViewDetails = (auctionId) => {
    router.push(`/auctions/${auctionId}`)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span>🏺</span>
              Rock the Auction
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bid History</h1>
          <p className="text-gray-400">
            Track all your bidding activity and manage your active bids.
          </p>
        </div>

        {/* Statistics */}
        <BidStatistics bids={bidHistory} />

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search bid history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 pl-10 text-white focus:border-orange-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="amount">Highest Bid</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Filter Tabs */}
        <BidFilterTabs 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          counts={counts} 
        />

        {/* Bid History Items */}
        {sortedBids.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold mb-2">
              {searchTerm ? 'No bids found' : 'No bidding history yet'}
            </h3>
            <p className="text-gray-400 mb-8">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start bidding on auctions to see your history here'
              }
            </p>
            <Link
              href="/auctions"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition inline-block"
            >
              Browse Auctions
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedBids.map(bid => (
              <BidHistoryItem
                key={bid.id}
                bid={bid}
                onRebid={handleRebid}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
