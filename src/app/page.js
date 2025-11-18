'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AuctionCard from '@/components/AuctionCard'
import CategoryCard from '@/components/CategoryCard'
import Footer from '@/components/Footer'
import auctionAPI from '@/lib/auctionAPI'

// ✅ UPDATED: Dynamic category icons mapping
const categoryIcons = {
  "Memorabilia": "🎤",
  "Watches": "⌚",
  "Comics": "📚", 
  "Fine Art": "🖼️",
  "Rare Shoes": "👟",
  "Collectibles": "🏆",
  "Jewelry": "💍",
  "Vintage": "🕰️",
  "Sports": "⚽",
  "Technology": "💻",
  "Fashion": "👗",
  "Music": "🎸",
  "Toys": "🧸",
  "Electronics": "📱",
  "Books": "📖",
  "Art": "🎨",
  "Antiques": "🏺",
  "Cars": "🚗",
  "Furniture": "🪑",
  "Clothing": "👕"
}

export default function HomePage() {
  const router = useRouter()
  
  // ✅ NEW: Separate state for all auctions, live, ended, and recently added
  const [allAuctions, setAllAuctions] = useState([])
  const [liveAuctions, setLiveAuctions] = useState([])
  const [endedAuctions, setEndedAuctions] = useState([])
  const [recentlyAddedAuctions, setRecentlyAddedAuctions] = useState([])
  
  // ✅ NEW: Dynamic categories state
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  // ✅ NEW: Enhanced hover state for categories with timer
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [categoryItems, setCategoryItems] = useState([])
  const [isHoverListVisible, setIsHoverListVisible] = useState(false)
  
  const [loadingLive, setLoadingLive] = useState(true)
  const [errorLive, setErrorLive] = useState('')

  // ✅ NEW: Check if mobile device
  const [isMobile, setIsMobile] = useState(false)
  
  // ✅ NEW: Refs and timers for hover management
  const hoverTimeoutRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ✅ UPDATED: Fetch all auctions and categorize them + extract categories
  useEffect(() => {
    const fetchAllAuctions = async () => {
      try {
        setLoadingLive(true)
        setLoadingCategories(true)
        const data = await auctionAPI.getAuctions()
        // Handle both array format and object with data property (backend returns {success: true, data: [...], pagination: {...}})
        const list = Array.isArray(data) ? data : (data.data || data.auctions || [])
        
        console.log('📊 Total auctions fetched:', list.length)
        
        // Set all auctions
        setAllAuctions(list)
        
        const now = new Date()
        
        // ✅ Separate live and ended auctions
        const live = list.filter(auction => {
          const endDate = new Date(auction.endDate)
          return endDate > now
        })
        
        const ended = list.filter(auction => {
          const endDate = new Date(auction.endDate)
          return endDate <= now
        })
        
        // ✅ Recently added auctions (sorted newest to oldest)
        const recentlyAdded = [...list]
          .sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0))
          .filter(auction => {
            const endDate = new Date(auction.endDate)
            return endDate > now // Only show live auctions in recently added
          })
        
        setLiveAuctions(live)
        setEndedAuctions(ended)
        setRecentlyAddedAuctions(recentlyAdded)
        
        // ✅ NEW: Extract categories from auctions
        const uniqueCategories = new Set()
        const categoryData = []

        list.forEach(auction => {
          if (auction.category && !uniqueCategories.has(auction.category)) {
            uniqueCategories.add(auction.category)
            categoryData.push({
              id: auction.category.toLowerCase().replace(/\s+/g, '-'),
              name: auction.category,
              label: auction.category, // For compatibility with CategoryCard
              icon: <span>{categoryIcons[auction.category] || "🏷️"}</span>,
              count: list.filter(a => a.category === auction.category).length
            })
          }
        })

        // ✅ Fallback categories if none found
        if (categoryData.length === 0) {
          console.log('⚠️ No categories found in API, using fallback data')
          const fallbackCategories = [
            { id: 'memorabilia', name: 'Memorabilia', label: 'Memorabilia', icon: <span>🎤</span>, count: 15 },
            { id: 'watches', name: 'Watches', label: 'Watches', icon: <span>⌚</span>, count: 23 },
            { id: 'comics', name: 'Comics', label: 'Comics', icon: <span>📚</span>, count: 8 },
            { id: 'fine-art', name: 'Fine Art', label: 'Fine Art', icon: <span>🖼️</span>, count: 12 },
            { id: 'rare-shoes', name: 'Rare Shoes', label: 'Rare Shoes', icon: <span>👟</span>, count: 19 },
            { id: 'collectibles', name: 'Collectibles', label: 'Collectibles', icon: <span>🏆</span>, count: 34 },
            { id: 'jewelry', name: 'Jewelry', label: 'Jewelry', icon: <span>💍</span>, count: 27 },
            { id: 'vintage', name: 'Vintage', label: 'Vintage', icon: <span>🕰️</span>, count: 16 },
          ]
          setCategories(fallbackCategories)
        } else {
          setCategories(categoryData.sort((a, b) => b.count - a.count)) // Sort by count descending
        }
        
        console.log(`📊 Live auctions: ${live.length}`)
        console.log(`📊 Ended auctions: ${ended.length}`)
        console.log(`📊 Recently added: ${recentlyAdded.length}`)
        console.log(`📊 Categories: ${categoryData.length}`)
        
      } catch (err) {
        console.error('Failed to load auctions', err)
        setErrorLive('Failed to load auctions.')
        
        // Fallback categories on error
        const fallbackCategories = [
          { id: 'memorabilia', name: 'Memorabilia', label: 'Memorabilia', icon: <span>🎤</span>, count: 15 },
          { id: 'watches', name: 'Watches', label: 'Watches', icon: <span>⌚</span>, count: 23 },
          { id: 'comics', name: 'Comics', label: 'Comics', icon: <span>📚</span>, count: 8 },
          { id: 'fine-art', name: 'Fine Art', label: 'Fine Art', icon: <span>🖼️</span>, count: 12 },
          { id: 'rare-shoes', name: 'Rare Shoes', label: 'Rare Shoes', icon: <span>👟</span>, count: 19 },
        ]
        setCategories(fallbackCategories)
      } finally {
        setLoadingLive(false)
        setLoadingCategories(false)
      }
    }
    fetchAllAuctions()
  }, [])

  // ✅ NEW: Enhanced category hover with delayed show/hide
  const handleCategoryHover = (categoryName, event) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }

    if (!categoryName) {
      // Hide after a short delay to allow cursor movement to list
      hideTimeoutRef.current = setTimeout(() => {
        setHoveredCategory(null)
        setCategoryItems([])
        setIsHoverListVisible(false)
      }, 150)
      return
    }

    // Show immediately if same category, or after delay if different
    if (categoryName === hoveredCategory) {
      setIsHoverListVisible(true)
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCategory(categoryName)
        
        // Filter auctions by category and get top 6
        const filteredItems = allAuctions
          .filter(auction => auction.category === categoryName)
          .sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0))
          .slice(0, 6)
        
        setCategoryItems(filteredItems)
        setIsHoverListVisible(true)
      }, 300) // Delay before showing
    }
  }

  // ✅ NEW: Handle hover list area hover
  const handleListHover = () => {
    // Clear hide timeout when hovering over list
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    setIsHoverListVisible(true)
  }

  // ✅ NEW: Handle hover list leave
  const handleListLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
      setCategoryItems([])
      setIsHoverListVisible(false)
    }, 150)
  }

  // ✅ NEW: Handle category click
  const handleCategoryClick = (categoryId, categoryName) => {
    console.log('🔍 Category clicked:', { categoryId, categoryName })
    router.push(`/auctions?category=${encodeURIComponent(categoryName)}`)
  }

  // ✅ NEW: Handle item click from hover list
  const handleItemClick = (auctionId) => {
    router.push(`/auctions/${auctionId}`)
  }

  // ✅ NEW: Mobile category tap handler
  const handleMobileCategoryTap = (categoryName) => {
    if (hoveredCategory === categoryName) {
      // If already showing, navigate to category
      handleCategoryClick(categoryName.toLowerCase().replace(/\s+/g, '-'), categoryName)
    } else {
      // Show items list
      setHoveredCategory(categoryName)
      const filteredItems = allAuctions
        .filter(auction => auction.category === categoryName)
        .sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0))
        .slice(0, 6)
      setCategoryItems(filteredItems)
      setIsHoverListVisible(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* Hero section */}
      <section className="max-w-5xl mx-auto mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex-1 order-2 md:order-1">
            <div className="flex-1 block md:hidden mb-6">
              <img 
                src="/RMA-Logo.png"
                alt="Rock My Auction"
                className="rounded-lg shadow-lg w-full h-auto max-w-xs mx-auto sm:max-w-sm"
              />
            </div>
            <div className="flex-1 hidden md:block mb-8 lg:mb-10">
              <img 
                src="/RMA-Logo.png"
                alt="Rock My Auction"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold mb-3 sm:mb-4 leading-tight text-white text-center md:text-left">
              One Auction Platform to Combine Them All
            </h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base max-w-lg text-center md:text-left mx-auto md:mx-0">
              Discover art, watches, collectibles, and more in exclusive live auctions —powered by AI for smarter selling and bidding.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start">
              <Link 
                href="/auctions" 
                className="w-full sm:w-auto text-center bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 sm:px-8 py-3 font-semibold shadow transition-colors"
              >
                Explore Live Auctions
              </Link>
              <Link href="/seller/new-auction" className="w-full sm:w-auto">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 sm:px-8 py-3 font-semibold shadow transition-colors">
                  + Add New Auction
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Featured Live Auctions */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Featured Live Auctions</h2>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {loadingLive ? 'Loading...' : `${liveAuctions.length} Live`}
            </span>
          </div>
        </div>
        
        {loadingLive ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : errorLive ? (
          <div className="text-red-400 text-center py-8">
            <p>{errorLive}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        ) : liveAuctions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏺</div>
            <h3 className="text-lg font-semibold mb-2">No Live Auctions</h3>
            <p className="text-gray-400 mb-6">Be the first to start an auction!</p>
            <Link 
              href="/seller/new-auction"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition inline-block"
            >
              Create First Auction
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {liveAuctions
                .sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0))
                .slice(0, 3)
                .map((auction) => (
                  <AuctionCard
                    key={auction._id || auction.id}
                    auction={auction}
                    title={auction.title}
                    currentBid={auction.currentBid || auction.startingPrice}
                    users={auction.bidCount || auction.bids?.length || 0}
                    endTime={new Date(auction.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    imageUrl={auction.imageUrl || auction.images?.[0]}
                    auctionId={auction._id || auction.id}
                    type="live"
                    onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                  />
                ))
              }
            </div>
            
            {liveAuctions.length > 3 && (
              <div className="text-center mt-8">
                <Link 
                  href="/auctions"
                  className="inline-flex items-center gap-2 bg-[#18181B] hover:bg-[#232326] border border-[#232326] hover:border-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <span>View All {liveAuctions.length} Live Auctions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* ✅ UNIFIED: Premium Trending Categories with Consistent Layout */}
      <section className="max-w-6xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6 relative" ref={containerRef}>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            ✨ Trending Categories
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            {isMobile 
              ? 'Tap categories to discover amazing items • Tap again to explore all auctions' 
              : 'Hover over categories to preview exclusive items • Click to explore complete collections'
            }
          </p>
          {!loadingCategories && categories.length > 0 && (
            <div className="mt-2 text-orange-400 text-sm font-medium">
              {categories.length} Premium Categories Available
            </div>
          )}
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
              <div key={i} className="bg-gradient-to-br from-[#18181B] to-[#232326] p-6 rounded-2xl flex flex-col items-center justify-center animate-pulse border border-[#333] shadow-lg aspect-square">
                <div className="bg-gray-700 h-12 w-12 rounded-full mb-4"></div>
                <div className="bg-gray-700 h-4 rounded w-20 mb-2"></div>
                <div className="bg-gray-700 h-3 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ✅ UPDATED: Consistent Grid with Equal Card Sizes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {categories.slice(0, 12).map((category, index) => (
                <div
                  key={category.id}
                  onMouseEnter={!isMobile ? (e) => handleCategoryHover(category.name, e) : undefined}
                  onMouseLeave={!isMobile ? () => handleCategoryHover(null) : undefined}
                  onClick={isMobile ? () => handleMobileCategoryTap(category.name) : () => handleCategoryClick(category.id, category.name)}
                  className="relative group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                  
                  {/* ✅ UPDATED: Main Card with Consistent Aspect Ratio */}
                  <div className="relative bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] hover:from-[#232326] hover:via-[#2a2a2e] hover:to-[#333336] border border-[#333] hover:border-orange-500/40 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl group aspect-square">
                    
                    {/* Trending Badge */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12">
                        🔥 HOT
                      </div>
                    )}
                    
                    {/* Category Icon with Glow Effect */}
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                    </div>
                    
                    {/* Category Name with Gradient Text */}
                    <h3 className="font-bold text-white text-xs sm:text-sm text-center mb-2 group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                      {category.name}
                    </h3>
                    
                    {/* Item Count with Enhanced Styling */}
                    {category.count && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-orange-300 transition-colors duration-300">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-60 group-hover:opacity-100"></div>
                        <span className="font-medium">{category.count} items</span>
                      </div>
                    )}
                    
                    {/* Hover Indicator */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-1 text-xs text-orange-400 font-medium">
                        <span>{isMobile ? 'Tap to explore' : 'Click to explore'}</span>
                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Ripple Effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-orange-500/5 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ UNIFIED: Consistent Items List for All Screen Sizes */}
            {hoveredCategory && categoryItems.length > 0 && isHoverListVisible && (
              <div 
                className="mt-8 bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] border-2 border-orange-500/30 rounded-2xl shadow-2xl p-5 backdrop-blur-sm"
                onMouseEnter={handleListHover}
                onMouseLeave={handleListLeave}
              >
                {/* Glowing Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-purple-500/20 rounded-2xl opacity-50 blur-sm"></div>
                
                {/* Enhanced Header with Close Button for All Devices */}
                <div className="relative flex items-center justify-between mb-4 pb-3 border-b border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl">
                      {categoryIcons[hoveredCategory] || "🏷️"}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg sm:text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        {hoveredCategory}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">Premium Collection • {categoryItems.length} Featured Items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs text-orange-400 font-medium">
                      LIVE
                    </div>
                    <button
                      onClick={() => {
                        setHoveredCategory(null)
                        setIsHoverListVisible(false)
                      }}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/30 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ✅ RESPONSIVE: Items List with Consistent Layout */}
                <div className="relative space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {categoryItems.map((item, index) => (
                    <div
                      key={item._id || item.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleItemClick(item._id || item.id)
                      }}
                      className="group/item flex items-center gap-4 p-3 sm:p-4 rounded-xl hover:bg-orange-500/10 border border-transparent hover:border-orange-500/30 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Enhanced Item Image */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#333] shadow-lg">
                        <img
                          src={item.imageUrl || item.images?.[0] || '/placeholder-auction.svg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                      </div>

                      {/* Enhanced Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-white truncate group-hover/item:text-orange-400 transition-colors duration-300 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-1 rounded-full">
                            ${(item.currentBid || item.startingPrice || 0).toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              new Date(item.endDate) > new Date() ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-gray-400">
                              {new Date(item.endDate) > new Date() ? 'Live' : 'Ended'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Arrow */}
                      <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/item:translate-x-0">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced View All Button */}
                <div className="relative mt-4 pt-3 border-t border-orange-500/20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategoryClick(hoveredCategory.toLowerCase().replace(/\s+/g, '-'), hoveredCategory)
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Explore All {hoveredCategory} Auctions</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Categories Summary */}
            {categories.length > 0 && (
              <div className="mt-10 bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-2xl p-6 border border-orange-500/20 shadow-xl">
                <h3 className="text-lg font-bold text-center mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  🎯 Collection Overview
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center group">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-400 group-hover:scale-110 transition-transform">
                      {categories.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Premium Categories</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform">
                      {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Total Items</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 group-hover:scale-110 transition-transform flex items-center justify-center gap-1">
                      {liveAuctions.length}
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Live Now</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #2a2a2e;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #f97316, #dc2626);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #ea580c, #b91c1c);
          }
        `}</style>
      </section>

      {/* Rest of your sections remain the same... */}
      {/* ✅ Recently Added Auctions */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Recently Added Auctions</h2>
          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm font-medium">Latest</span>
          </div>
        </div>
        
        {loadingLive ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : recentlyAddedAuctions.length === 0 ? (
          <div className="text-center py-8 bg-[#18181B] rounded-lg border border-[#232326]">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-gray-400">No recently added auctions</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentlyAddedAuctions
                .slice(0, 3)
                .map((auction) => (
                  <AuctionCard
                    key={`recent-${auction._id || auction.id}`}
                    auction={auction}
                    title={auction.title}
                    currentBid={auction.currentBid || auction.startingPrice}
                    users={auction.bidCount || auction.bids?.length || 0}
                    endTime={new Date(auction.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    imageUrl={auction.imageUrl || auction.images?.[0]}
                    auctionId={auction._id || auction.id}
                    type="live"
                    onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                  />
                ))
              }
            </div>
            
            {recentlyAddedAuctions.length > 3 && (
              <div className="text-center mt-6">
                <Link 
                  href="/auctions?sort=newest"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                >
                  <span>View All Recent Auctions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* ✅ Recently Ended Auctions */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Recently Ended Auctions</h2>
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium">
              {loadingLive ? 'Loading...' : `${endedAuctions.length} Ended`}
            </span>
          </div>
        </div>
        
        {loadingLive ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        ) : endedAuctions.length === 0 ? (
          <div className="text-center py-8 bg-[#18181B] rounded-lg border border-[#232326]">
            <div className="text-3xl mb-2">⏰</div>
            <p className="text-gray-400">No recently ended auctions</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {endedAuctions
                .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
                .slice(0, 3)
                .map((auction) => {
                  const daysAgo = Math.floor((Date.now() - new Date(auction.endDate)) / (1000*60*60*24))
                  const hoursAgo = Math.floor((Date.now() - new Date(auction.endDate)) / (1000*60*60))
                  const endedText = daysAgo > 0 
                    ? `Ended ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`
                    : `Ended ${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`
                  return (
                    <AuctionCard
                      key={`ended-${auction._id || auction.id}`}
                      auction={auction}
                      title={auction.title}
                      currentBid={auction.currentBid || auction.startingPrice}
                      users={auction.bidCount || auction.bids?.length || 0}
                      endTime={endedText}
                      imageUrl={auction.imageUrl || auction.images?.[0]}
                      auctionId={auction._id || auction.id}
                      type="ended"
                      onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                    />
                  )
                })
              }
            </div>
            
            {endedAuctions.length > 3 && (
              <div className="text-center mt-6">
                <Link 
                  href="/auctions?filter=ended"
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium"
                >
                  <span>View All {endedAuctions.length} Ended Auctions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Call-to-action */}
      <section className="max-w-5xl mx-auto mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-center text-white rounded-2xl py-6 sm:py-8 px-4 font-semibold shadow-lg">
          <div className="text-lg sm:text-xl mb-4 sm:mb-0 sm:inline">
            Ready to find your next gem?
          </div>
          <Link
            href="/auctions"
            className="inline-block w-full sm:w-auto sm:ml-4 mt-3 sm:mt-0 bg-white hover:bg-gray-100 text-orange-500 rounded-lg px-4 sm:px-6 py-2 sm:py-2 font-bold transition-colors shadow-md"
          >
            <span className="block sm:inline">Discover All Live Auctions</span>
            <span className="hidden sm:inline ml-1">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
