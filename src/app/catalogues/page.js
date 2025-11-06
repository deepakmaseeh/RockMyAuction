'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import auctionAPI from '@/lib/auctionAPI'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Helper function to get or create default user ID
function getDefaultUserId() {
  let defaultUserId = localStorage.getItem('default-user-id')
  if (!defaultUserId) {
    // Create a default user ID if none exists
    defaultUserId = 'default-user-' + Date.now()
    localStorage.setItem('default-user-id', defaultUserId)
    localStorage.setItem('user-data', JSON.stringify({
      id: defaultUserId,
      name: 'Demo User',
      email: 'demo@example.com'
    }))
    localStorage.setItem('auth-token', 'demo-token')
  }
  return defaultUserId
}

export default function CataloguesPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useUserRole()
  const [catalogues, setCatalogues] = useState([])
  const [activeAuctions, setActiveAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [auctionsLoading, setAuctionsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('catalogues') // 'catalogues' or 'auctions'

  // Auto-login with default user if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const defaultUserId = getDefaultUserId()
      const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
      
      login({
        id: defaultUserId,
        name: userData.name || 'Demo User',
        email: userData.email || 'demo@example.com'
      })
    }
  }, [isAuthenticated, login])

  useEffect(() => {
    loadCatalogues()
  }, [statusFilter])

  useEffect(() => {
    loadActiveAuctions()
  }, [])

  const loadCatalogues = async () => {
    try {
      setLoading(true)
      const url = statusFilter === 'all' 
        ? '/api/catalogues' 
        : `/api/catalogues?status=${statusFilter}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setCatalogues(data.catalogues || [])
      } else {
        setError('Failed to load catalogues')
      }
    } catch (err) {
      console.error('Error loading catalogues:', err)
      setError('Failed to load catalogues')
    } finally {
      setLoading(false)
    }
  }

  const loadActiveAuctions = async () => {
    try {
      setAuctionsLoading(true)
      const data = await auctionAPI.getAuctions()
      const auctionsList = Array.isArray(data) ? data : data.auctions || []
      
      // Filter only active auctions (not ended)
      const now = new Date()
      const active = auctionsList.filter(auction => {
        const endDate = new Date(auction.endDate || auction.endTime)
        return endDate > now
      })
      
      setActiveAuctions(active)
    } catch (err) {
      console.error('Error loading active auctions:', err)
    } finally {
      setAuctionsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this catalogue? This will also delete all associated lots.')) {
      return
    }

    try {
      const response = await fetch(`/api/catalogues/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        loadCatalogues()
      } else {
        alert('Failed to delete catalogue')
      }
    } catch (err) {
      console.error('Error deleting catalogue:', err)
      alert('Failed to delete catalogue')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      published: 'bg-green-500',
      archived: 'bg-gray-600'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-500'} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Mobile Optimized */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Catalogs & Auctions
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                  Manage your auction catalogues and view active auctions
                </p>
              </div>
              <Link
                href="/catalogues/new"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base whitespace-nowrap"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Catalogue</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>

          {/* Tabs - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 bg-[#18181B] rounded-xl p-1 sm:p-2 border border-[#232326]">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('catalogues')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all rounded-lg whitespace-nowrap touch-manipulation text-sm sm:text-base ${
                  activeTab === 'catalogues'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#232326]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📚</span>
                  <span>Catalogues</span>
                  <span className="ml-1 px-2 py-0.5 bg-black/20 rounded-full text-xs font-semibold">
                    {catalogues.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('auctions')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all rounded-lg whitespace-nowrap touch-manipulation text-sm sm:text-base ${
                  activeTab === 'auctions'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#232326]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔥</span>
                  <span>Active Auctions</span>
                  <span className="ml-1 px-2 py-0.5 bg-black/20 rounded-full text-xs font-semibold">
                    {activeAuctions.length}
                  </span>
                </span>
              </button>
            </div>
          </div>

        {/* Catalogues Tab */}
        {activeTab === 'catalogues' && (
          <>
            {/* Filters - Mobile Optimized */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { key: 'all', label: 'All', icon: '📋' },
                  { key: 'draft', label: 'Draft', icon: '📝' },
                  { key: 'published', label: 'Published', icon: '✅' },
                  { key: 'archived', label: 'Archived', icon: '📦' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all touch-manipulation text-sm sm:text-base ${
                      statusFilter === filter.key
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                        : 'bg-[#18181B] text-gray-300 hover:bg-[#232326] hover:text-white border border-[#232326]'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="text-center py-16 sm:py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-500 border-t-transparent"></div>
                <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-base">Loading catalogues...</p>
              </div>
            ) : catalogues.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-[#18181B] rounded-xl sm:rounded-2xl border border-[#232326] px-4 sm:px-6">
                <div className="text-6xl sm:text-7xl mb-4">📚</div>
                <p className="text-gray-400 text-base sm:text-lg mb-6">No catalogues found</p>
                <Link
                  href="/catalogues/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {catalogues.map((catalogue) => (
                  <div
                    key={catalogue._id}
                    className="group bg-[#18181B] rounded-xl sm:rounded-2xl border border-[#232326] hover:border-orange-500/50 transition-all overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden bg-[#232326]">
                      {catalogue.coverImage ? (
                        <img
                          src={catalogue.coverImage}
                          alt={catalogue.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Status Badge Overlay */}
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(catalogue.status)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3rem]">
                        {catalogue.title}
                      </h3>
                      
                      {catalogue.description && (
                        <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                          {catalogue.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-400">
                        {catalogue.auctionDate && (
                          <div className="flex items-center gap-2">
                            <span className="text-base">📅</span>
                            <span>{new Date(catalogue.auctionDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {catalogue.location && (
                          <div className="flex items-center gap-2">
                            <span className="text-base">📍</span>
                            <span className="truncate">{catalogue.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-base">📦</span>
                          <span>{catalogue.lots?.length || 0} lots</span>
                        </div>
                        {catalogue.metadata?.estimatedValue > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-base">💰</span>
                            <span className="text-orange-400 font-semibold">
                              ${catalogue.metadata.estimatedValue.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/catalogues/${catalogue._id}`}
                          className="flex-1 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base"
                        >
                          View
                        </Link>
                        <div className="flex gap-2">
                          <Link
                            href={`/catalogues/${catalogue._id}/edit`}
                            className="flex-1 sm:flex-none text-center bg-[#232326] text-white font-semibold py-2.5 px-3 sm:px-4 rounded-lg hover:bg-[#2a2a2e] transition-all transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base"
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">✏️</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(catalogue._id)}
                            className="flex-1 sm:flex-none text-center bg-red-500/80 text-white font-semibold py-2.5 px-3 sm:px-4 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base"
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Active Auctions Tab */}
        {activeTab === 'auctions' && (
          <>
            {auctionsLoading ? (
              <div className="text-center py-16 sm:py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-500 border-t-transparent"></div>
                <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-base">Loading active auctions...</p>
              </div>
            ) : activeAuctions.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-[#18181B] rounded-xl sm:rounded-2xl border border-[#232326] px-4 sm:px-6">
                <div className="text-6xl sm:text-7xl mb-4">🔥</div>
                <p className="text-gray-400 text-base sm:text-lg mb-6">No active auctions found</p>
                <Link
                  href="/seller/new-auction"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Auction
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {activeAuctions.map((auction) => {
                  const endDate = new Date(auction.endDate || auction.endTime)
                  const now = new Date()
                  const timeLeft = endDate - now
                  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
                  const daysLeft = Math.floor(hoursLeft / 24)
                  
                  return (
                    <Link
                      key={auction._id || auction.id}
                      href={`/auctions/${auction._id || auction.id}`}
                      className="group bg-[#18181B] rounded-xl sm:rounded-2xl border border-[#232326] hover:border-orange-500/50 transition-all overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden bg-[#232326]">
                        {auction.images?.[0] ? (
                          <img
                            src={auction.images[0]}
                            alt={auction.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {/* LIVE Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg animate-pulse">
                            🔴 LIVE
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3rem]">
                          {auction.title}
                        </h3>
                        
                        {auction.description && (
                          <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                            {auction.description}
                          </p>
                        )}

                        {/* Details */}
                        <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-400">
                          {auction.category && (
                            <div className="flex items-center gap-2">
                              <span className="text-base">🏷️</span>
                              <span>{auction.category}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-base">⏰</span>
                            <span className="text-orange-400 font-semibold">
                              {daysLeft > 0 ? `${daysLeft}d` : `${hoursLeft}h`} left
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">💰</span>
                            <span className="text-orange-400 font-bold text-base sm:text-lg">
                              ${(auction.currentBid || auction.startingBid || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 touch-manipulation text-center text-sm sm:text-base">
                          View Auction →
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

