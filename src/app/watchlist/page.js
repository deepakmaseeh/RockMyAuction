'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

// Mock watchlist data
const mockWatchlistItems = [
  {
    id: 1,
    title: "Vintage 1962 Fender Stratocaster",
    image: "/auctions/guitar.jpg",
    currentBid: 15500,
    timeLeft: "2h 30m",
    status: "LIVE",
    bids: 156,
    seller: "VintageGuitars",
    category: "Musical Instruments",
    endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
    watchedSince: "2 days ago",
    highestBid: 14800,
    isWinning: false
  },
  {
    id: 2,
    title: "Rare Baseball Card Collection",
    image: "/auctions/baseball.jpg",
    currentBid: 4200,
    timeLeft: "6h 15m",
    status: "LIVE",
    bids: 89,
    seller: "SportsCardsDepot",
    category: "Sports Cards",
    endTime: new Date(Date.now() + 6.25 * 60 * 60 * 1000),
    watchedSince: "1 week ago",
    highestBid: 4000,
    isWinning: true
  },
  {
    id: 3,
    title: "Abstract Art Sculpture by Arya",
    image: "/auctions/sculpture.jpg",
    currentBid: 2800,
    timeLeft: "1d 5h",
    status: "LIVE",
    bids: 34,
    seller: "ModernArtStudy",
    category: "Sculpture",
    endTime: new Date(Date.now() + 29 * 60 * 60 * 1000),
    watchedSince: "3 days ago",
    highestBid: 0,
    isWinning: false
  },
  {
    id: 4,
    title: "Vintage Stamp Collection 1840",
    image: "/auctions/stamp.jpg",
    currentBid: 6800,
    timeLeft: "3d 12h",
    status: "LIVE",
    bids: 92,
    seller: "PhilatelyCorner",
    category: "Stamps",
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    watchedSince: "5 days ago",
    highestBid: 6500,
    isWinning: true
  },
  {
    id: 5,
    title: "KAWS Companion Limited Edition",
    image: "/auctions/kaws.jpg",
    currentBid: 850,
    timeLeft: "ENDED",
    status: "ENDED",
    bids: 22,
    seller: "ArtCollective",
    category: "Art",
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    watchedSince: "1 month ago",
    highestBid: 800,
    isWinning: false,
    finalResult: "LOST"
  }
]

// Watchlist Item Component
function WatchlistItem({ item, onRemove, onPlaceBid }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (item.status === 'ENDED') {
      setTimeLeft('ENDED')
      return
    }

    const calculateTimeLeft = () => {
      const difference = new Date(item.endTime) - new Date()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setTimeLeft(`${minutes}m`)
        }
      } else {
        setTimeLeft('ENDED')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [item.endTime, item.status])

  const isUrgent = timeLeft.includes('m') && !timeLeft.includes('h') && !timeLeft.includes('d')
  const isEnded = item.status === 'ENDED'

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-24 h-24 bg-[#232326] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={item.image || '/placeholder-auction.jpg'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                isEnded ? 'bg-gray-500 text-white' : 
                isUrgent ? 'bg-red-500 text-white animate-pulse' : 
                'bg-green-500 text-white'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-lg truncate pr-4">
                {item.title}
              </h3>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-400 transition flex-shrink-0"
                title="Remove from watchlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <span>by {item.seller}</span>
              <span>•</span>
              <span>Watched {item.watchedSince}</span>
              <span>•</span>
              <span className="bg-[#232326] px-2 py-1 rounded">{item.category}</span>
            </div>

            {/* Bidding Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400">Current Bid</div>
                <div className="font-bold text-orange-400">${item.currentBid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Your Highest</div>
                <div className="font-bold text-white">
                  {item.highestBid > 0 ? `$${item.highestBid.toLocaleString()}` : 'No bids'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Time Left</div>
                <div className={`font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Total Bids</div>
                <div className="font-bold text-blue-400">{item.bids}</div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.isWinning && !isEnded && (
                  <span className="bg-green-600 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                    🏆 Winning
                  </span>
                )}
                {isEnded && item.finalResult === 'LOST' && (
                  <span className="bg-red-600 text-red-100 px-2 py-1 rounded-full text-xs font-medium">
                    Lost
                  </span>
                )}
                {isEnded && item.finalResult === 'WON' && (
                  <span className="bg-green-600 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                    Won!
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/auctions/${item.id}`}
                  className="px-4 py-2 bg-[#232326] hover:bg-[#2a2a2e] text-gray-300 rounded-lg text-sm font-medium transition"
                >
                  View Details
                </Link>
                {!isEnded && (
                  <button
                    onClick={() => onPlaceBid(item)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    Place Bid
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
function FilterTabs({ activeFilter, setActiveFilter, counts }) {
  const filters = [
    { key: 'all', label: 'All Items', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'winning', label: 'Winning', count: counts.winning },
    { key: 'ended', label: 'Ended', count: counts.ended }
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

// Main Watchlist Page
export default function WatchlistPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [watchlistItems, setWatchlistItems] = useState(mockWatchlistItems)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter items based on active filter
  const filteredItems = watchlistItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    switch (activeFilter) {
      case 'active':
        return item.status === 'LIVE'
      case 'winning':
        return item.isWinning && item.status === 'LIVE'
      case 'ended':
        return item.status === 'ENDED'
      default:
        return true
    }
  })

  // Calculate counts for filter tabs
  const counts = {
    all: watchlistItems.length,
    active: watchlistItems.filter(item => item.status === 'LIVE').length,
    winning: watchlistItems.filter(item => item.isWinning && item.status === 'LIVE').length,
    ended: watchlistItems.filter(item => item.status === 'ENDED').length
  }

  // Remove item from watchlist
  const handleRemoveFromWatchlist = (itemId) => {
    if (confirm('Remove this item from your watchlist?')) {
      setWatchlistItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  // Place bid on item
  const handlePlaceBid = (item) => {
    router.push(`/auctions/${item.id}`)
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
          <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
          <p className="text-gray-400">
            Keep track of auctions you're interested in and never miss a bidding opportunity.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search watchlist..."
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
        </div>

        {/* Filter Tabs */}
        <FilterTabs 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          counts={counts} 
        />

        {/* Watchlist Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold mb-2">
              {searchTerm ? 'No items found' : 'Your watchlist is empty'}
            </h3>
            <p className="text-gray-400 mb-8">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start watching auctions to keep track of items you\'re interested in'
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
            {filteredItems.map(item => (
              <WatchlistItem
                key={item.id}
                item={item}
                onRemove={handleRemoveFromWatchlist}
                onPlaceBid={handlePlaceBid}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {watchlistItems.length > 0 && (
          <div className="mt-12 bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <h3 className="text-xl font-bold mb-4">Watchlist Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{counts.all}</div>
                <div className="text-sm text-gray-400">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{counts.winning}</div>
                <div className="text-sm text-gray-400">Currently Winning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{counts.active}</div>
                <div className="text-sm text-gray-400">Active Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{counts.ended}</div>
                <div className="text-sm text-gray-400">Ended Auctions</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
