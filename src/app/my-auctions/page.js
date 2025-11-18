'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import auctionAPI from '@/lib/auctionAPI'

export default function MyAuctionsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUserRole()
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Load user's auctions
  useEffect(() => {
    if (isAuthenticated && user) {
      loadMyAuctions()
    }
  }, [isAuthenticated, user?.id, user?._id])

  const loadMyAuctions = async () => {
    try {
      setLoading(true)
      
      // Get user ID - try both _id and id
      let userId = user?._id || user?.id
      
      // If no user ID, try to get current user from API
      if (!userId) {
        console.log('No user ID in context, fetching current user from API...')
        try {
          const currentUser = await auctionAPI.getCurrentUser()
          userId = currentUser?._id || currentUser?.id
          console.log('Fetched user from API:', currentUser)
        } catch (err) {
          console.error('Failed to fetch current user:', err)
        }
      }
      
      if (!userId) {
        console.error('No user ID found:', { user, userId })
        setAuctions([])
        setFilteredAuctions([])
        return
      }

      console.log('Loading auctions for user ID:', userId)
      console.log('User object:', user)
      
      // Get auctions created by the current user
      const response = await auctionAPI.getAuctions({ createdBy: userId })
      
      console.log('Auctions API response:', response)
      console.log('Response type:', typeof response)
      console.log('Is array:', Array.isArray(response))
      
      // Handle different response formats
      let auctionsList = []
      if (response?.success && response?.data) {
        auctionsList = Array.isArray(response.data) ? response.data : []
      } else if (Array.isArray(response)) {
        auctionsList = response
      } else if (response?.auctions) {
        auctionsList = Array.isArray(response.auctions) ? response.auctions : []
      } else if (response?.data) {
        auctionsList = Array.isArray(response.data) ? response.data : []
      }
      
      console.log('Parsed auctions list:', auctionsList)
      console.log('Number of auctions:', auctionsList.length)
      
      setAuctions(auctionsList)
      setFilteredAuctions(auctionsList)
    } catch (error) {
      console.error('Failed to load auctions:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        user: user,
        userId: user?._id || user?.id
      })
      setAuctions([])
      setFilteredAuctions([])
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort auctions
  useEffect(() => {
    let filtered = [...auctions]

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(auction => {
        const now = new Date()
        const endDate = new Date(auction.endDate)
        
        switch (activeTab) {
          case 'active':
            return auction.status === 'active' && endDate > now
          case 'ended':
            return auction.status === 'ended' || endDate <= now
          case 'draft':
            return auction.status === 'draft'
          case 'sold':
            return auction.status === 'sold'
          default:
            return true
        }
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'ending_soon':
          return new Date(a.endDate) - new Date(b.endDate)
        case 'highest_bid':
          return (b.currentBid || 0) - (a.currentBid || 0)
        case 'most_views':
          return (b.views || 0) - (a.views || 0)
        case 'most_bids':
          return (b.bidCount || 0) - (a.bidCount || 0)
        default:
          return 0
      }
    })

    setFilteredAuctions(filtered)
  }, [auctions, activeTab, searchTerm, sortBy])

  // Calculate statistics
  const stats = {
    total: auctions.length,
    active: auctions.filter(a => {
      const endDate = new Date(a.endDate)
      return a.status === 'active' && endDate > new Date()
    }).length,
    ended: auctions.filter(a => {
      const endDate = new Date(a.endDate)
      return a.status === 'ended' || endDate <= new Date()
    }).length,
    totalViews: auctions.reduce((sum, a) => sum + (a.views || 0), 0),
    totalBids: auctions.reduce((sum, a) => sum + (a.bidCount || 0), 0),
    totalRevenue: auctions
      .filter(a => a.status === 'sold')
      .reduce((sum, a) => sum + (a.currentBid || 0), 0)
  }

  const calculateTimeLeft = (endDate) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end - now

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleDelete = async (auctionId) => {
    if (!confirm('Are you sure you want to delete this auction? This action cannot be undone.')) {
      return
    }

    try {
      await auctionAPI.deleteAuction(auctionId)
      await loadMyAuctions()
      alert('Auction deleted successfully')
    } catch (error) {
      console.error('Failed to delete auction:', error)
      alert('Failed to delete auction. Please try again.')
    }
  }

  const getStatusBadge = (auction) => {
    const now = new Date()
    const endDate = new Date(auction.endDate)
    const isEnded = endDate <= now || auction.status === 'ended'
    const isActive = auction.status === 'active' && endDate > now
    const isDraft = auction.status === 'draft'
    const isSold = auction.status === 'sold'

    if (isSold) {
      return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white">SOLD</span>
    }
    if (isDraft) {
      return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-600 text-white">DRAFT</span>
    }
    if (isEnded) {
      return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500 text-white">ENDED</span>
    }
    if (isActive) {
      const timeLeft = calculateTimeLeft(auction.endDate)
      const isUrgent = timeLeft.includes('h') && parseInt(timeLeft) < 2
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          isUrgent ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'
        }`}>
          LIVE
        </span>
      )
    }
    return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500 text-white">{auction.status?.toUpperCase() || 'UNKNOWN'}</span>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Auctions</h1>
              <p className="text-gray-400 text-sm sm:text-base">Track and manage all your created auctions</p>
            </div>
            <Link
              href="/seller/new-auction"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Auction
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            <div className="bg-[#18181B] border border-[#232326] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Total Auctions</div>
              <div className="text-lg sm:text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-[#18181B] border border-[#232326] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Active</div>
              <div className="text-lg sm:text-2xl font-bold text-green-400">{stats.active}</div>
            </div>
            <div className="bg-[#18181B] border border-[#232326] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Ended</div>
              <div className="text-lg sm:text-2xl font-bold text-gray-400">{stats.ended}</div>
            </div>
            <div className="bg-[#18181B] border border-[#232326] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Total Views</div>
              <div className="text-lg sm:text-2xl font-bold text-blue-400">{stats.totalViews}</div>
            </div>
            <div className="bg-[#18181B] border border-[#232326] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Total Bids</div>
              <div className="text-lg sm:text-2xl font-bold text-orange-400">{stats.totalBids}</div>
            </div>
            <div className="bg-[#18181B] border border-[#232326] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Revenue</div>
              <div className="text-lg sm:text-2xl font-bold text-green-400">${stats.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#18181B] border border-[#232326] rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#232326] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="highest_bid">Highest Bid</option>
              <option value="most_views">Most Views</option>
              <option value="most_bids">Most Bids</option>
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'active', label: 'Active', count: stats.active },
              { key: 'ended', label: 'Ended', count: stats.ended },
              { key: 'draft', label: 'Draft', count: auctions.filter(a => a.status === 'draft').length },
              { key: 'sold', label: 'Sold', count: auctions.filter(a => a.status === 'sold').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                  activeTab === tab.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#232326] text-gray-300 hover:bg-[#2a2a2e]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-xs">
            <div className="font-semibold text-yellow-400 mb-2">Debug Info:</div>
            <div className="text-gray-400 space-y-1">
              <div>User ID: {user?._id || user?.id || 'Not found'}</div>
              <div>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
              <div>Total Auctions: {auctions.length}</div>
              <div>Filtered Auctions: {filteredAuctions.length}</div>
              <div>Active Tab: {activeTab}</div>
            </div>
          </div>
        )}

        {/* Auctions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-12 bg-[#18181B] rounded-lg border border-[#232326]">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              {auctions.length === 0 ? 'No auctions yet' : 'No auctions match your filters'}
            </h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              {auctions.length === 0 
                ? 'Start by creating your first auction!' 
                : 'Try adjusting your search or filters'}
            </p>
            {auctions.length === 0 && (
              <Link
                href="/seller/new-auction"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base"
              >
                Create Your First Auction
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAuctions.map((auction) => {
              const timeLeft = calculateTimeLeft(auction.endDate)
              const isEnded = timeLeft === 'Ended'
              const bidIncrease = ((auction.currentBid || 0) - (auction.startingPrice || 0)) / (auction.startingPrice || 1) * 100

              return (
                <div
                  key={auction._id || auction.id}
                  className="bg-[#18181B] border border-[#232326] rounded-lg sm:rounded-xl overflow-hidden hover:border-orange-500/50 transition"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                      <img
                        src={auction.imageUrl || auction.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (!e.target.src.includes('data:image')) {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
                          }
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(auction)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 hover:text-orange-400 transition">
                            <Link href={`/auctions/${auction._id || auction.id}`}>
                              {auction.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{auction.description}</p>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Starting Price</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-300">
                                ${(auction.startingPrice || 0).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Current Bid</div>
                              <div className="text-sm sm:text-base font-semibold text-orange-400">
                                ${(auction.currentBid || auction.startingPrice || 0).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Bids</div>
                              <div className="text-sm sm:text-base font-semibold text-white">
                                {auction.bidCount || auction.bids?.length || 0}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Views</div>
                              <div className="text-sm sm:text-base font-semibold text-blue-400">
                                {auction.views || 0}
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {auction.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {isEnded ? 'Ended' : `Ends: ${timeLeft}`}
                            </span>
                            {bidIncrease > 0 && (
                              <span className="flex items-center gap-1 text-green-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                +{bidIncrease.toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Link
                            href={`/auctions/${auction._id || auction.id}`}
                            className="px-4 py-2 bg-[#232326] hover:bg-[#2a2a2e] text-white rounded-lg font-medium transition text-center text-sm sm:text-base"
                          >
                            View Details
                          </Link>
                          {!isEnded && auction.status !== 'sold' && auction.status !== 'ended' && (
                            <button
                              onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(auction._id || auction.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

