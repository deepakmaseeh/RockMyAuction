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

// Mobile-optimized Bid History Item Component
function BidHistoryItem({ bid, onRebid, onViewDetails }) {
  const [showDetails, setShowDetails] = useState(false)

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
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          {/* Image */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#232326] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={bid.image || '/placeholder-auction.jpg'}
              alt={bid.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-sm sm:text-lg line-clamp-2 pr-2">
                {bid.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                  <span className="sm:hidden">{getStatusIcon(bid.status)}</span>
                  <span className="hidden sm:inline">{getStatusIcon(bid.status)} {bid.status}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 mb-3">
              <span>by {bid.seller}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{bid.category}</span>
              <span className="sm:hidden">•</span>
              <span>{formatTime(bid.bidTime)}</span>
            </div>

            {/* Mobile: Simplified grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <div className="text-xs text-gray-400">My Bid</div>
                <div className="font-bold text-white text-sm sm:text-base">${bid.bidAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Current</div>
                <div className={`font-bold text-sm sm:text-base ${
                  bid.status === 'WINNING' ? 'text-green-400' : 
                  bid.status === 'OUTBID' ? 'text-orange-400' : 'text-white'
                }`}>
                  ${bid.currentBid.toLocaleString()}
                </div>
              </div>
              <div className="sm:block">
                <div className="text-xs text-gray-400">Bids</div>
                <div className="font-bold text-blue-400 text-sm sm:text-base">{bid.myBidCount}</div>
              </div>
              <div className="sm:block">
                <div className="text-xs text-gray-400">Time</div>
                <div className="font-bold text-white text-sm sm:text-base">{bid.timeLeft}</div>
              </div>
            </div>

            {/* Mobile: Collapsible details */}
            <div className="sm:block">
              {/* Auto-bid Info */}
              {bid.isAutoBid && bid.maxBid && (
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-blue-400 text-xs sm:text-sm">
                    <span>🤖</span>
                    <span>Auto-bid up to ${bid.maxBid.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Won/Lost Info */}
              {bid.status === 'WON' && (
                <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-green-400 text-xs sm:text-sm gap-1 sm:gap-0">
                    <span>🎉 You won this auction!</span>
                    <span>Final: ${bid.finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {bid.status === 'LOST' && (
                <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-red-400 text-xs sm:text-sm gap-1 sm:gap-0">
                    <span>Auction ended - Better luck next time!</span>
                    <span>Final: ${bid.finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="text-xs text-gray-400 order-2 sm:order-1">
                Total bids: {bid.totalBids} • Auction {bid.auctionStatus.toLowerCase()}
              </div>
              <div className="flex gap-2 order-1 sm:order-2">
                <button
                  onClick={() => onViewDetails(bid.auctionId)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#232326] hover:bg-[#2a2a2e] active:bg-[#323238] text-gray-300 rounded-lg text-xs sm:text-sm font-medium transition touch-manipulation"
                >
                  View Details
                </button>
                {(bid.status === 'OUTBID' || bid.status === 'WINNING') && bid.auctionStatus === 'LIVE' && (
                  <button
                    onClick={() => onRebid(bid)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg text-xs sm:text-sm font-medium transition touch-manipulation"
                  >
                    {bid.status === 'OUTBID' ? 'Rebid' : 'Increase'}
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

// Mobile-optimized Filter Tabs Component
function BidFilterTabs({ activeFilter, setActiveFilter, counts }) {
  const filters = [
    { key: 'all', label: 'All', shortLabel: 'All', count: counts.all },
    { key: 'active', label: 'Active', shortLabel: 'Active', count: counts.active },
    { key: 'winning', label: 'Winning', shortLabel: 'Win', count: counts.winning },
    { key: 'won', label: 'Won', shortLabel: 'Won', count: counts.won },
    { key: 'lost', label: 'Lost', shortLabel: 'Lost', count: counts.lost }
  ]

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] mb-6 sm:mb-8">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-manipulation ${
              activeFilter === filter.key
                ? 'bg-orange-500 text-white'
                : 'bg-[#232326] text-gray-300 hover:bg-[#2a2a2e] hover:text-white active:bg-[#323238]'
            }`}
          >
            <span className="sm:hidden">{filter.shortLabel}</span>
            <span className="hidden sm:inline">{filter.label}</span>
            <span className={`text-xs px-1.5 sm:px-2 py-1 rounded-full ${
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

// Mobile-optimized Statistics Cards Component
function BidStatistics({ bids }) {
  const stats = {
    totalBids: bids.reduce((sum, bid) => sum + bid.myBidCount, 0),
    totalSpent: bids.filter(bid => bid.status === 'WON').reduce((sum, bid) => sum + bid.finalPrice, 0),
    successRate: bids.length > 0 ? Math.round((bids.filter(bid => bid.status === 'WON').length / bids.length) * 100) : 0,
    avgBidAmount: bids.length > 0 ? Math.round(bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / bids.length) : 0
  }

  const statCards = [
    { label: 'Total Bids', shortLabel: 'Bids', value: stats.totalBids, color: 'text-orange-400' },
    { label: 'Total Won Value', shortLabel: 'Won', value: `$${stats.totalSpent.toLocaleString()}`, color: 'text-green-400' },
    { label: 'Success Rate', shortLabel: 'Success', value: `${stats.successRate}%`, color: 'text-blue-400' },
    { label: 'Avg Bid Amount', shortLabel: 'Avg', value: `$${stats.avgBidAmount.toLocaleString()}`, color: 'text-purple-400' }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-6 border border-[#232326]">
          <div className="text-center">
            <div className={`text-xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">
              <span className="sm:hidden">{stat.shortLabel}</span>
              <span className="hidden sm:inline">{stat.label}</span>
            </div>
          </div>
        </div>
      ))}
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
  const [showSearch, setShowSearch] = useState(false)

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
      {/* Mobile-optimized Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-lg sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span>🏺</span>
              <span className="hidden sm:inline">Rock the Auction</span>
              <span className="sm:hidden">RMA</span>
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition text-sm sm:text-base">
              <span className="hidden sm:inline">← Back to Dashboard</span>
              <span className="sm:hidden">← Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Bid History</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Track all your bidding activity and manage your active bids.
          </p>
        </div>

        {/* Statistics */}
        <BidStatistics bids={bidHistory} />

        {/* Mobile Search Toggle */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 text-orange-400 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {showSearch ? 'Hide Search' : 'Search & Sort'}
          </button>
        </div>

        {/* Search and Sort */}
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 ${showSearch ? 'block' : 'hidden sm:flex'}`}>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search bid history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 pl-10 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
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
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">🏷️</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              {searchTerm ? 'No bids found' : 'No bidding history yet'}
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start bidding on auctions to see your history here'
              }
            </p>
            <Link
              href="/auctions"
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-block touch-manipulation text-sm sm:text-base"
            >
              Browse Auctions
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
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
