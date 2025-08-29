'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AuctionCard from '@/components/AuctionCard'
import CategoryCard from '@/components/CategoryCard'
import Footer from '@/components/Footer'
import auctionAPI from '@/lib/auctionAPI'

const categories = [
  { label: "Memorabilia", icon: <span>🎤</span> },
  { label: "Watches",      icon: <span>⌚</span> },
  { label: "Comics",       icon: <span>📚</span> },
  { label: "Fine Art",     icon: <span>🖼️</span> },
  { label: "Rare Shoes",   icon: <span>👟</span> },
]

export default function HomePage() {
  const router = useRouter()
  
  // ✅ NEW: Separate state for all auctions, live, ended, and recently added
  const [allAuctions, setAllAuctions] = useState([])
  const [liveAuctions, setLiveAuctions] = useState([])
  const [endedAuctions, setEndedAuctions] = useState([])
  const [recentlyAddedAuctions, setRecentlyAddedAuctions] = useState([])
  
  const [loadingLive, setLoadingLive] = useState(true)
  const [errorLive, setErrorLive] = useState('')

  // ✅ UPDATED: Fetch all auctions and categorize them
  useEffect(() => {
    const fetchAllAuctions = async () => {
      try {
        setLoadingLive(true)
        const data = await auctionAPI.getAuctions()
        const list = Array.isArray(data) ? data : data.auctions || []
        
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
        
        console.log(`📊 Live auctions: ${live.length}`)
        console.log(`📊 Ended auctions: ${ended.length}`)
        console.log(`📊 Recently added: ${recentlyAdded.length}`)
        
      } catch (err) {
        console.error('Failed to load auctions', err)
        setErrorLive('Failed to load auctions.')
      } finally {
        setLoadingLive(false)
      }
    }
    fetchAllAuctions()
  }, [])

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-white text-center md:text-left">
              One Drop. One Winner.
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

      {/* ✅ Featured Live Auctions - Show Only 3 Cards */}
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
              {liveAuctions.slice(0, 3).map((auction) => (
                <AuctionCard
                  key={auction._id || auction.id}
                  image={auction.images?.[0] || '/placeholder.png'}
                  title={auction.title}
                  currentBid={auction.currentBid || auction.startingPrice}
                  users={auction.bidCount || auction.bids?.length || 0}
                  endDate={new Date(auction.endDate).toLocaleString()}
                  onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                />
              ))}
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

      {/* Trending Categories */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl mb-4 font-bold">Trending Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat.label + idx} {...cat} />
          ))}
        </div>
      </section>

      {/* ✅ NEW: Recently Added Auctions (Newest to Oldest) */}
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
              {recentlyAddedAuctions.slice(0, 3).map((auction) => (
                <AuctionCard
                  key={`recent-${auction._id || auction.id}`}
                  image={auction.images?.[0] || '/placeholder.png'}
                  title={auction.title}
                  currentBid={auction.currentBid || auction.startingPrice}
                  users={auction.bidCount || auction.bids?.length || 0}
                  endDate={new Date(auction.endDate).toLocaleString()}
                  onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                />
              ))}
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

      {/* ✅ FIXED: Recently Ended Auctions - Now shows actual ended auctions */}
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
                .sort((a, b) => new Date(b.endDate) - new Date(a.endDate)) // Sort by most recently ended
                .slice(0, 3)
                .map((auction) => {
                  const daysAgo = Math.floor((Date.now() - new Date(auction.endDate)) / (1000*60*60*24))
                  const hoursAgo = Math.floor((Date.now() - new Date(auction.endDate)) / (1000*60*60))
                  
                  return (
                    <AuctionCard
                      key={`ended-${auction._id || auction.id}`}
                      image={auction.images?.[0] || '/placeholder.png'}
                      title={auction.title}
                      currentBid={auction.currentBid || auction.startingPrice}
                      users={auction.bidCount || auction.bids?.length || 0}
                      endDate={daysAgo > 0 ? `Ended ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago` : `Ended ${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`}
                      type="ended"
                      onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                    />
                  )
                })}
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
