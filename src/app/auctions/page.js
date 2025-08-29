'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import auctionAPI from '@/lib/auctionAPI'

// Mock featured auction (keep as fallback)
const featuredAuction = {
  id: 99,
  title: "The Midnight Chronograph",
  description: "This limited edition timepiece showcases exceptional craftsmanship and timeless design. Don't miss your chance to own a piece of history.",
  image: "/auctions/featured-watch.jpg",
  currentBid: 12500,
  timeLeft: "4h 32m",
  bids: 234,
  status: "FEATURED"
}

// ✅ FIXED: Mobile-optimized AuctionCard Component with seller error fix
function AuctionCard({ auction }) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(auction.endDate || auction.endTime).getTime()
      const difference = endTime - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${seconds}s`)
        }
      } else {
        setTimeLeft('ENDED')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [auction.endDate, auction.endTime])

  const isUrgent = timeLeft.includes('m') && !timeLeft.includes('h') && parseInt(timeLeft) < 30
  const isEnded = timeLeft === 'ENDED'

  // ✅ FIXED: Safely get seller name and first character
  const getSeller = () => {
    const seller = auction.seller || auction.sellerId || auction.createdBy || auction.owner
    
    if (seller) {
      if (typeof seller === 'object' && seller.name) {
        return seller.name
      }
      if (typeof seller === 'string') {
        return seller
      }
    }
    return 'Unknown Seller'
  }

  const getSellerInitial = () => {
    const sellerName = getSeller()
    return sellerName.charAt(0).toUpperCase()
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all duration-300 group overflow-hidden">
      {/* Status Badge */}
      <div className="relative">
        <img
          src={auction.images?.[0] || auction.image || '/placeholder-auction.svg'}
          alt={auction.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            isEnded ? 'bg-gray-500 text-white' : 
            isUrgent ? 'bg-red-500 text-white animate-pulse' : 
            'bg-green-500 text-white'
          }`}>
            {isEnded ? 'ENDED' : 'LIVE NOW'}
          </span>
        </div>
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
          {auction.bidCount || auction.bids?.length || 0} bids
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-white text-sm sm:text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors leading-tight">
          {auction.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="text-lg sm:text-2xl font-bold text-orange-400">
              ${(auction.currentBid || auction.startingPrice || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Current Bid</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-sm sm:text-lg font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}
            </div>
            <div className="text-xs text-gray-400">Time Left</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getSellerInitial()}
            </div>
            <span className="text-xs sm:text-sm text-gray-400 truncate">{getSeller()}</span>
          </div>
          <span className="text-xs bg-[#232326] text-gray-300 px-2 py-1 rounded flex-shrink-0">
            {auction.category || 'General'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium text-center transition text-sm sm:text-base touch-manipulation ${
              isEnded 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white'
            }`}
          >
            {isEnded ? 'View Results' : 'Place Bid'}
          </button>
          <button className="p-2 bg-[#232326] hover:bg-[#2a2a2e] active:bg-[#323238] text-gray-300 rounded-lg transition touch-manipulation">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized SearchFilters Component
function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories
}) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-4 sm:hidden">
        <h3 className="text-lg font-semibold">Search & Filter</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-orange-400 text-sm font-medium flex items-center gap-1"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
          <svg
            className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Search Input - Always Visible */}
        <div className="relative sm:col-span-1 md:col-span-1">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
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

        {/* Filter dropdowns */}
        <div className={`col-span-1 sm:col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ${
          showFilters ? 'block' : 'hidden sm:grid'
        }`}>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer text-sm sm:text-base"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer text-sm sm:text-base"
          >
            <option value="ending-soon">Ending Soon</option>
            <option value="highest-bid">Highest Bid</option>
            <option value="most-bids">Most Bids</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// Main Auctions Page Component
export default function AuctionsPage() {
  const router = useRouter()
  
  // API Integration for Live Auctions
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // ✅ NEW: All Auctions state
  const [allAuctions, setAllAuctions] = useState([])
  const [filteredAllAuctions, setFilteredAllAuctions] = useState([])
  const [allAuctionsDisplayCount, setAllAuctionsDisplayCount] = useState(8) // Show 8 initially
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('ending-soon')

  // Fetch Live Auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true)
        setError('')
        console.log('🔍 Fetching auctions from API...')
        
        const data = await auctionAPI.getAuctions()
        console.log('✅ Auctions data received:', data)
        
        // Handle both array format and object with auctions property
        const auctionsList = Array.isArray(data) ? data : data.auctions || []
        
        // ✅ Set all auctions (both live and ended)
        setAllAuctions(auctionsList)
        
        // Filter only live/active auctions (not ended) for live section
        const liveAuctions = auctionsList.filter(auction => {
          const endDate = new Date(auction.endDate || auction.endTime)
          const now = new Date()
          return endDate > now // Only show auctions that haven't ended
        })
        
        setAuctions(liveAuctions)
        console.log(`📊 ${liveAuctions.length} live auctions loaded`)
        console.log(`📊 ${auctionsList.length} total auctions loaded`)
        
      } catch (err) {
        console.error('❌ Failed to fetch auctions:', err)
        setError('Failed to load auctions. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  // Filter and search functionality for Live Auctions
  useEffect(() => {
    let filtered = auctions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(auction => auction.category === selectedCategory)
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return new Date(a.endDate || a.endTime) - new Date(b.endDate || b.endTime)
        case 'highest-bid':
          return (b.currentBid || b.startingPrice || 0) - (a.currentBid || a.startingPrice || 0)
        case 'most-bids':
          return (b.bidCount || b.bids?.length || 0) - (a.bidCount || a.bids?.length || 0)
        case 'newest':
          return new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0)
        default:
          return 0
      }
    })

    setFilteredAuctions(filtered)
  }, [searchTerm, selectedCategory, sortBy, auctions])

  // ✅ NEW: Filter and search functionality for All Auctions
  useEffect(() => {
    let filtered = allAuctions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(auction => auction.category === selectedCategory)
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return new Date(a.endDate || a.endTime) - new Date(b.endDate || b.endTime)
        case 'highest-bid':
          return (b.currentBid || b.startingPrice || 0) - (a.currentBid || a.startingPrice || 0)
        case 'most-bids':
          return (b.bidCount || b.bids?.length || 0) - (a.bidCount || a.bids?.length || 0)
        case 'newest':
          return new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0)
        default:
          return 0
      }
    })

    setFilteredAllAuctions(filtered)
    setAllAuctionsDisplayCount(8) // Reset display count when filters change
  }, [searchTerm, selectedCategory, sortBy, allAuctions])

  // Extract categories from API data
  const categories = ['All', ...new Set(allAuctions.map(auction => auction.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* Mobile-optimized Featured Auction Hero */}
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-r from-red-900/20 to-orange-900/20 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${featuredAuction.image})` }}
        />
        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6">
          <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            FEATURED AUCTION
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            {featuredAuction.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            {featuredAuction.description}
          </p>
          
          {/* Mobile-optimized stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-orange-400">
                ${featuredAuction.currentBid.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Current Bid</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                {featuredAuction.timeLeft}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-400">
                {featuredAuction.bids}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Bids</div>
            </div>
          </div>
          
          <Link 
            href={`/auctions/${featuredAuction.id}`}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition inline-block touch-manipulation"
          >
            View Auction Details
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />
      </section>

      {/* Live Auctions Grid with API Integration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Live Auctions</h2>
          <div className="flex items-center gap-2 text-green-400 self-start sm:self-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {loading ? 'Loading...' : `${filteredAuctions.length} Live Auctions`}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-red-400">Error Loading Auctions</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">No live auctions found</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {auctions.length === 0 
                ? 'No live auctions available at the moment. Check back soon!' 
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction._id || auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ NEW: All Auctions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold">All Auctions</h2>
          <div className="flex items-center gap-2 text-blue-400 self-start sm:self-auto">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-sm font-medium">
              {loading ? 'Loading...' : `${filteredAllAuctions.length} Total Auctions`}
            </span>
          </div>
        </div>

        {/* All Auctions Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-red-400">Error Loading Auctions</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        ) : filteredAllAuctions.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">📦</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">No auctions found</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {allAuctions.length === 0 
                ? 'No auctions available at the moment. Check back soon!' 
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAllAuctions.slice(0, allAuctionsDisplayCount).map((auction) => (
                <AuctionCard key={`all-${auction._id || auction.id}`} auction={auction} />
              ))}
            </div>

            {/* Load More Button for All Auctions */}
            {allAuctionsDisplayCount < filteredAllAuctions.length && (
              <div className="text-center mt-8 sm:mt-12">
                <button 
                  onClick={() => setAllAuctionsDisplayCount(prev => prev + 8)}
                  className="bg-[#18181B] border border-[#232326] hover:border-blue-500 active:bg-[#232326] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base"
                >
                  Load More Auctions ({filteredAllAuctions.length - allAuctionsDisplayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Mobile-optimized Newsletter Signup */}
      <section className="bg-[#18181B] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Stay up-to-date with exclusive drops!</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Get notified about the latest auctions and never miss a deal.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
            />
            <button 
              onClick={() => alert('Newsletter signup would be implemented here')}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition touch-manipulation text-sm sm:text-base"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
