'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import Navbar from '@/components/Navbar'

// Mock active listings data
const mockActiveListings = [
  {
    id: 1,
    title: "Vintage Rolex Datejust Third Hand",
    image: "/auctions/watch1.jpg",
    startingBid: 1000,
    currentBid: 2550,
    bids: 45,
    views: 342,
    timeLeft: "2h 30m",
    status: "LIVE",
    category: "Watches",
    condition: "Excellent",
    listedDate: "2024-01-15",
    endDate: "2024-01-20"
  },
  {
    id: 2,
    title: "KAWS Companion (Flayed) Limited Edition",
    image: "/auctions/kaws.jpg",
    startingBid: 500,
    currentBid: 850,
    bids: 22,
    views: 156,
    timeLeft: "4h 15m",
    status: "LIVE",
    category: "Art",
    condition: "New",
    listedDate: "2024-01-16",
    endDate: "2024-01-21"
  },
  {
    id: 3,
    title: "Air Jordan 1 Retro High OG Chicago",
    image: "/auctions/jordan.jpg",
    startingBid: 800,
    currentBid: 1200,
    bids: 67,
    views: 289,
    timeLeft: "1d 5h",
    status: "LIVE",
    category: "Sneakers",
    condition: "Very Good",
    listedDate: "2024-01-14",
    endDate: "2024-01-22"
  },
  {
    id: 4,
    title: "First Edition Harry Potter Book",
    image: "/auctions/book.jpg",
    startingBid: 2000,
    currentBid: 3500,
    bids: 38,
    views: 198,
    timeLeft: "3d 8h",
    status: "LIVE",
    category: "Books",
    condition: "Good",
    listedDate: "2024-01-12",
    endDate: "2024-01-25"
  },
  {
    id: 5,
    title: "Baseball Card Collection",
    image: "/auctions/baseball.jpg",
    startingBid: 1500,
    currentBid: 0,
    bids: 0,
    views: 45,
    timeLeft: "6d 2h",
    status: "NO_BIDS",
    category: "Sports Cards",
    condition: "Excellent",
    listedDate: "2024-01-18",
    endDate: "2024-01-28"
  }
]

// Listing Item Component
function ListingItem({ listing, onEdit, onDelete, onPromote }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE':
        return 'bg-green-600 text-green-100'
      case 'NO_BIDS':
        return 'bg-yellow-600 text-yellow-100'
      case 'ENDING_SOON':
        return 'bg-red-600 text-red-100'
      default:
        return 'bg-gray-600 text-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'LIVE':
        return '🟢'
      case 'NO_BIDS':
        return '⚠️'
      case 'ENDING_SOON':
        return '🔥'
      default:
        return '⏸️'
    }
  }

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image */}
          <div className="w-full sm:w-24 h-48 sm:h-24 bg-[#232326] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={listing.imageUrl || listing.image || '/placeholder-auction.jpg'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-white text-lg pr-4">
                {listing.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusColor(listing.status)}`}>
                {getStatusIcon(listing.status)} {listing.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-3">
              <span>{listing.category}</span>
              <span>•</span>
              <span>Condition: {listing.condition}</span>
              <span>•</span>
              <span>Listed: {new Date(listing.listedDate).toLocaleDateString()}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400">Starting Bid</div>
                <div className="font-bold text-white text-sm sm:text-base">${listing.startingBid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Current Bid</div>
                <div className="font-bold text-orange-400 text-sm sm:text-base">
                  {listing.currentBid > 0 ? `$${listing.currentBid.toLocaleString()}` : 'No bids'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Total Bids</div>
                <div className="font-bold text-blue-400 text-sm sm:text-base">{listing.bids}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Views</div>
                <div className="font-bold text-purple-400 text-sm sm:text-base">{listing.views}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs text-gray-400">Time Left</div>
                <div className="font-bold text-white text-sm sm:text-base">{listing.timeLeft}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-gray-400">
                Ends: {new Date(listing.endDate).toLocaleDateString()}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onEdit(listing)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onPromote(listing)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                >
                  Promote
                </button>
                <Link
                  href={`/auctions/${listing.id}`}
                  className="px-3 py-1 bg-[#232326] hover:bg-[#2a2a2e] text-gray-300 rounded text-sm transition"
                >
                  View
                </Link>
                <button
                  onClick={() => onDelete(listing)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Filter Controls Component
function FilterControls({ filters, setFilters, onSearch }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326] mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <input
            type="text"
            placeholder="Search listings..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 pl-10 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Watches">Watches</option>
          <option value="Art">Art</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Books">Books</option>
          <option value="Sports Cards">Sports Cards</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="LIVE">Live</option>
          <option value="NO_BIDS">No Bids</option>
          <option value="ENDING_SOON">Ending Soon</option>
        </select>

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="ending_soon">Ending Soon</option>
          <option value="highest_bid">Highest Bid</option>
          <option value="most_views">Most Views</option>
        </select>
      </div>
    </div>
  )
}

export default function ActiveAuctionsPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [listings, setListings] = useState(mockActiveListings)
  const [filteredListings, setFilteredListings] = useState(mockActiveListings)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'newest'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Filter and sort listings
  useEffect(() => {
    let filtered = listings

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(listing => listing.category === filters.category)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(listing => listing.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'ending_soon':
          return new Date(a.endDate) - new Date(b.endDate)
        case 'highest_bid':
          return b.currentBid - a.currentBid
        case 'most_views':
          return b.views - a.views
        default: // newest
          return new Date(b.listedDate) - new Date(a.listedDate)
      }
    })

    setFilteredListings(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [filters, listings])

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage)

  // Action handlers
  const handleEdit = (listing) => {
    router.push(`/seller/edit-auction/${listing.id}`)
  }

  const handleDelete = (listing) => {
    if (confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      setListings(prev => prev.filter(l => l.id !== listing.id))
    }
  }

  const handlePromote = (listing) => {
    alert(`Promoting "${listing.title}" - This would boost visibility in search results!`)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Use Navbar Component */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Active Listings</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your live auctions and track their performance</p>
          </div>
          
          <Link
            href="/seller/new-auction"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base text-center"
          >
            + Add New Listing
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">{listings.length}</div>
              <div className="text-xs sm:text-sm text-gray-400">Total Active</div>
            </div>
          </div>
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">{listings.filter(l => l.status === 'LIVE' && l.bids > 0).length}</div>
              <div className="text-xs sm:text-sm text-gray-400">With Bids</div>
            </div>
          </div>
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{listings.filter(l => l.status === 'NO_BIDS').length}</div>
              <div className="text-xs sm:text-sm text-gray-400">No Bids</div>
            </div>
          </div>
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">{listings.reduce((sum, l) => sum + l.views, 0)}</div>
              <div className="text-xs sm:text-sm text-gray-400">Total Views</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterControls filters={filters} setFilters={setFilters} />

        {/* Listings */}
        {paginatedListings.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">📦</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">No listings found</h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Try adjusting your filters or create your first listing</p>
            <Link
              href="/seller/new-auction"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition inline-block text-sm sm:text-base"
            >
              Create New Listing
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {paginatedListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPromote={handlePromote}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-[#232326] hover:bg-[#2a2a2e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm sm:text-base"
                >
                  Previous
                </button>
                
                <div className="flex gap-1 sm:gap-2 max-w-xs overflow-x-auto">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base flex-shrink-0 ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'bg-[#232326] hover:bg-[#2a2a2e] text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-[#232326] hover:bg-[#2a2a2e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm sm:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
