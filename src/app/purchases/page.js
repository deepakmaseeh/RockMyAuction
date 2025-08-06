'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

// Mock purchased items data
const mockPurchases = [
  {
    id: 1,
    auctionId: 101,
    title: "Vintage Rolex Datejust 1971",
    image: "/auctions/watch1.jpg",
    seller: "LuxuryTimepieces",
    category: "Watches",
    finalPrice: 2400,
    myBids: 12,
    wonDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    rating: null,
    tracking: "1Z999AA1234567890",
    deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    auctionId: 102,
    title: "First Edition Harry Potter Book",
    image: "/auctions/book.jpg",
    seller: "RareBooksCollector",
    category: "Books",
    finalPrice: 3500,
    myBids: 8,
    wonDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "shipped",
    rating: 5,
    tracking: "1Z999AA1234567891",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    auctionId: 103,
    title: "Vintage Guitar 1961 Fender",
    image: "/auctions/guitar.jpg",
    seller: "VintageGuitars",
    category: "Musical Instruments",
    finalPrice: 15500,
    myBids: 24,
    wonDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "payment_pending",
    paymentStatus: "pending",
    deliveryStatus: "pending",
    rating: null,
    paymentDue: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    auctionId: 104,
    title: "Baseball Card Collection Mickey Mantle",
    image: "/auctions/baseball.jpg",
    seller: "SportsCardsDepot",
    category: "Sports Cards",
    finalPrice: 4200,
    myBids: 15,
    wonDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    rating: 4,
    tracking: "1Z999AA1234567892",
    deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
]

// Purchase Item Component
function PurchaseItem({ purchase, onRate, onContact, onTrack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-green-100'
      case 'payment_pending':
        return 'bg-yellow-600 text-yellow-100'
      case 'shipped':
        return 'bg-blue-600 text-blue-100'
      case 'delivered':
        return 'bg-green-600 text-green-100'
      case 'pending':
        return 'bg-gray-600 text-gray-100'
      default:
        return 'bg-gray-600 text-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'payment_pending':
        return '💳'
      case 'shipped':
        return '🚚'
      case 'delivered':
        return '📦'
      case 'pending':
        return '⏳'
      default:
        return '📍'
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const StarRating = ({ rating, onRate }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate && onRate(star)}
            className={`text-base sm:text-lg ${
              star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-600'
            } ${onRate ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
          >
            ⭐
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          {/* Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#232326] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={purchase.image || '/placeholder-auction.jpg'}
              alt={purchase.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-sm sm:text-lg line-clamp-2 pr-2">
                {purchase.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(purchase.status)}`}>
                <span className="hidden sm:inline">{getStatusIcon(purchase.status)} </span>
                <span className="text-xs">{purchase.status.replace('_', ' ').toUpperCase()}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 mb-3">
              <span>by {purchase.seller}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{purchase.category}</span>
              <span className="sm:hidden">•</span>
              <span>{formatDate(purchase.wonDate)}</span>
            </div>

            {/* Purchase Details Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <div className="text-xs text-gray-400">Final Price</div>
                <div className="font-bold text-green-400 text-sm sm:text-base">
                  ${purchase.finalPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Payment</div>
                <div className={`font-bold text-xs sm:text-sm ${
                  purchase.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {purchase.paymentStatus}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">My Bids</div>
                <div className="font-bold text-blue-400 text-sm">{purchase.myBids}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Delivery</div>
                <div className={`font-bold text-xs sm:text-sm ${
                  purchase.deliveryStatus === 'delivered' ? 'text-green-400' : 
                  purchase.deliveryStatus === 'shipped' ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {purchase.deliveryStatus}
                </div>
              </div>
            </div>

            {/* Status-specific Information */}
            {purchase.status === 'payment_pending' && (
              <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3 mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-yellow-400 text-sm">
                  <span className="text-xs sm:text-sm">⚠️ Payment due by {formatDate(purchase.paymentDue)}</span>
                  <button className="bg-yellow-600 text-yellow-100 px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700 transition self-start">
                    Pay Now
                  </button>
                </div>
              </div>
            )}

            {purchase.tracking && purchase.deliveryStatus === 'shipped' && (
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3 mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-blue-400 text-sm">
                  <span className="text-xs sm:text-sm break-all">📦 Tracking: {purchase.tracking}</span>
                  <button 
                    onClick={() => onTrack(purchase.tracking)}
                    className="bg-blue-600 text-blue-100 px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition self-start"
                  >
                    Track Package
                  </button>
                </div>
              </div>
            )}

            {purchase.deliveryStatus === 'delivered' && (
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-green-400 text-xs sm:text-sm">
                    ✅ Delivered on {formatDate(purchase.deliveryDate)}
                  </span>
                  {!purchase.rating && (
                    <span className="text-xs text-gray-400">Rate this purchase →</span>
                  )}
                </div>
              </div>
            )}

            {/* Rating Section */}
            {purchase.deliveryStatus === 'delivered' && (
              <div className="bg-[#232326] rounded-lg p-3 mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm text-gray-300">Rate this purchase:</span>
                  <StarRating 
                    rating={purchase.rating} 
                    onRate={purchase.rating ? null : (rating) => onRate(purchase.id, rating)}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-xs text-gray-400">
                Order #{purchase.id} • {purchase.myBids} bids
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onContact(purchase.seller)}
                  className="flex-1 sm:flex-initial px-3 py-1 bg-[#232326] hover:bg-[#2a2a2e] text-gray-300 rounded text-xs sm:text-sm transition"
                >
                  Contact
                </button>
                <Link
                  href={`/auctions/${purchase.auctionId}`}
                  className="flex-1 sm:flex-initial px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs sm:text-sm transition text-center"
                >
                  View Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Filter Tabs Component
function PurchaseFilterTabs({ activeFilter, setActiveFilter, counts }) {
  const filters = [
    { key: 'all', label: 'All Purchases', count: counts.all },
    { key: 'payment_pending', label: 'Payment Due', count: counts.payment_pending },
    { key: 'shipped', label: 'In Transit', count: counts.shipped },
    { key: 'delivered', label: 'Delivered', count: counts.delivered }
  ]

  return (
    <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326] mb-6 sm:mb-8">
      <div className="flex overflow-x-auto space-x-2 pb-2 sm:pb-0 sm:flex-wrap sm:gap-2">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition whitespace-nowrap flex-shrink-0 ${
              activeFilter === filter.key
                ? 'bg-orange-500 text-white'
                : 'bg-[#232326] text-gray-300 hover:bg-[#2a2a2e] hover:text-white'
            }`}
          >
            <span className="text-xs sm:text-sm">{filter.label}</span>
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

// Purchase Statistics Component
function PurchaseStatistics({ purchases }) {
  const stats = {
    totalPurchases: purchases.length,
    totalSpent: purchases.reduce((sum, p) => sum + p.finalPrice, 0),
    avgPurchaseValue: purchases.length > 0 ? Math.round(purchases.reduce((sum, p) => sum + p.finalPrice, 0) / purchases.length) : 0,
    pendingPayments: purchases.filter(p => p.paymentStatus === 'pending').length
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
        <div className="text-xl sm:text-3xl font-bold text-blue-400">{stats.totalPurchases}</div>
        <div className="text-xs sm:text-sm text-gray-400">Total Purchases</div>
      </div>
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
        <div className="text-xl sm:text-3xl font-bold text-green-400">${stats.totalSpent.toLocaleString()}</div>
        <div className="text-xs sm:text-sm text-gray-400">Total Spent</div>
      </div>
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
        <div className="text-xl sm:text-3xl font-bold text-purple-400">${stats.avgPurchaseValue.toLocaleString()}</div>
        <div className="text-xs sm:text-sm text-gray-400">Avg Purchase</div>
      </div>
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
        <div className="text-xl sm:text-3xl font-bold text-orange-400">{stats.pendingPayments}</div>
        <div className="text-xs sm:text-sm text-gray-400">Pending Payments</div>
      </div>
    </div>
  )
}

// Main Purchases Page
export default function PurchasesPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [purchases, setPurchases] = useState(mockPurchases)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  // Filter purchases based on active filter
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.seller.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    switch (activeFilter) {
      case 'payment_pending':
        return purchase.paymentStatus === 'pending'
      case 'shipped':
        return purchase.deliveryStatus === 'shipped'
      case 'delivered':
        return purchase.deliveryStatus === 'delivered'
      default:
        return true
    }
  })

  // Sort purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    switch (sortBy) {
      case 'price_high':
        return b.finalPrice - a.finalPrice
      case 'price_low':
        return a.finalPrice - b.finalPrice
      case 'oldest':
        return new Date(a.wonDate) - new Date(b.wonDate)
      default: // recent
        return new Date(b.wonDate) - new Date(a.wonDate)
    }
  })

  // Calculate counts for filter tabs
  const counts = {
    all: purchases.length,
    payment_pending: purchases.filter(p => p.paymentStatus === 'pending').length,
    shipped: purchases.filter(p => p.deliveryStatus === 'shipped').length,
    delivered: purchases.filter(p => p.deliveryStatus === 'delivered').length
  }

  // Handle rating
  const handleRate = (purchaseId, rating) => {
    setPurchases(prev => 
      prev.map(p => 
        p.id === purchaseId ? { ...p, rating } : p
      )
    )
    alert(`Rated ${rating} stars!`)
  }

  // Handle contact seller
  const handleContact = (seller) => {
    router.push(`/messages?seller=${seller}`)
  }

  // Handle package tracking
  const handleTrack = (tracking) => {
    alert(`Tracking package: ${tracking}`)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <img src="/RMA-Logo.png" alt="Rock My Auction" className="h-8 w-auto" />
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition text-sm sm:text-base">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Purchases</h1>
          <p className="text-sm sm:text-base text-gray-400">
            Track your won auctions, payments, and deliveries.
          </p>
        </div>

        {/* Statistics */}
        <PurchaseStatistics purchases={purchases} />

        {/* Search and Sort */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 pl-10 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none"
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
            className="w-full sm:w-auto bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="price_high">Highest Price</option>
            <option value="price_low">Lowest Price</option>
          </select>
        </div>

        {/* Filter Tabs */}
        <PurchaseFilterTabs 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          counts={counts} 
        />

        {/* Purchases List */}
        {sortedPurchases.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">📦</div>
            <h3 className="text-lg sm:text-2xl font-bold mb-2">
              {searchTerm ? 'No purchases found' : 'No purchases yet'}
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 px-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start bidding on auctions to see your purchases here'
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
          <div className="space-y-4 sm:space-y-6">
            {sortedPurchases.map(purchase => (
              <PurchaseItem
                key={purchase.id}
                purchase={purchase}
                onRate={handleRate}
                onContact={handleContact}
                onTrack={handleTrack}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
