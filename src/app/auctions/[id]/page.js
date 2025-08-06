'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

// Mock auction data (replace with real API call)
const getAuctionById = (id) => {
  const mockAuction = {
    id: parseInt(id),
    title: "Vintage Rolex Datejust Third Hand",
    description: "This exceptional 1971 Rolex Datejust represents the pinnacle of Swiss watchmaking excellence. The 36mm stainless steel case houses the legendary automatic movement, ensuring precision that has made Rolex the world's most trusted timepiece. The champagne dial features applied hour markers and the iconic date window at 3 o'clock with Cyclops magnification. The Jubilee bracelet shows minimal wear, indicating careful ownership. This piece comes with original box, papers, and full service history. A true collector's item that combines timeless elegance with investment potential.",
    images: [
      "/assets/PB-3.jpg",
      "/assets/PB-4.jpg", 
      "/assets/PB-3.jpg",
      "/assets/PB-4.jpg"
    ],
    currentBid: 2550,
    startingBid: 1000,
    reservePrice: 3000,
    reserveMet: false,
    bids: 45,
    seller: {
      name: "LuxuryTimepieces",
      rating: 4.9,
      totalSales: 234,
      joinedDate: "2019",
      verified: true,
      location: "New York, NY"
    },
    endTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000),
    condition: "Excellent",
    category: "Watches",
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    shipping: {
      cost: 25,
      methods: ["Standard", "Express", "Overnight"],
      international: true
    },
    specifications: {
      "Brand": "Rolex",
      "Model": "Datejust",
      "Year": "1971",
      "Case Size": "36mm",
      "Case Material": "Stainless Steel",
      "Movement": "Automatic",
      "Water Resistance": "100m",
      "Bracelet": "Jubilee",
      "Papers": "Yes",
      "Box": "Yes"
    },
    bidHistory: [
      { bidder: "Collector123", amount: 2550, time: "2 minutes ago", isWinning: true },
      { bidder: "WatchLover88", amount: 2500, time: "15 minutes ago", isWinning: false },
      { bidder: "TimeKeeper", amount: 2450, time: "32 minutes ago", isWinning: false },
      { bidder: "Collector123", amount: 2400, time: "1 hour ago", isWinning: false },
      { bidder: "VintageExpert", amount: 2350, time: "2 hours ago", isWinning: false }
    ]
  }
  return mockAuction
}

// Mobile-optimized Countdown Timer Component
function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date()
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
          setIsUrgent(hours < 1)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`)
          setIsUrgent(minutes < 30)
        } else {
          setTimeLeft(`${seconds}s`)
          setIsUrgent(true)
        }
      } else {
        setTimeLeft('ENDED')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className={`text-center p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 ${
      timeLeft === 'ENDED' ? 'border-gray-500 bg-gray-900' :
      isUrgent ? 'border-red-500 bg-red-900/20 animate-pulse' : 
      'border-orange-500 bg-orange-900/20'
    }`}>
      <div className="text-xs sm:text-sm text-gray-400 mb-2">Time Remaining</div>
      <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
        timeLeft === 'ENDED' ? 'text-gray-400' :
        isUrgent ? 'text-red-400' : 'text-orange-400'
      }`}>
        {timeLeft}
      </div>
      {timeLeft !== 'ENDED' && (
        <div className="text-xs text-gray-400 mt-2">
          {isUrgent ? 'Auction ending soon!' : 'Plenty of time left'}
        </div>
      )}
    </div>
  )
}

// Mobile-optimized Bid Form Component
function BidForm({ auction, onBidSubmit }) {
  const [bidAmount, setBidAmount] = useState('')
  const [maxBid, setMaxBid] = useState('')
  const [isProxyBid, setIsProxyBid] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const minBid = auction.currentBid + 25 // $25 minimum increment
  const suggestedBids = [
    auction.currentBid + 25,
    auction.currentBid + 50,
    auction.currentBid + 100,
    auction.currentBid + 250
  ]

  const validateBid = (amount) => {
    const numAmount = parseFloat(amount)
    const newErrors = {}

    if (!amount) {
      newErrors.bidAmount = 'Bid amount is required'
    } else if (isNaN(numAmount)) {
      newErrors.bidAmount = 'Please enter a valid number'
    } else if (numAmount < minBid) {
      newErrors.bidAmount = `Minimum bid is $${minBid.toLocaleString()}`
    } else if (numAmount > 1000000) {
      newErrors.bidAmount = 'Maximum bid is $1,000,000'
    }

    if (isProxyBid) {
      const numMaxBid = parseFloat(maxBid)
      if (!maxBid) {
        newErrors.maxBid = 'Maximum bid is required for proxy bidding'
      } else if (isNaN(numMaxBid)) {
        newErrors.maxBid = 'Please enter a valid number'
      } else if (numMaxBid <= numAmount) {
        newErrors.maxBid = 'Maximum bid must be higher than current bid'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateBid(bidAmount)) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onBidSubmit({
        amount: parseFloat(bidAmount),
        maxBid: isProxyBid ? parseFloat(maxBid) : null,
        isProxy: isProxyBid
      })

      // Reset form
      setBidAmount('')
      setMaxBid('')
      setIsProxyBid(false)
      
    } catch (error) {
      setErrors({ submit: 'Failed to place bid. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Place Your Bid</h3>
      
      {/* Current Status */}
      <div className="bg-[#232326] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Current Bid</span>
            <span className="text-xl sm:text-2xl font-bold text-orange-400">
              ${auction.currentBid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Minimum Bid</span>
            <span className="text-base sm:text-lg font-semibold text-white">
              ${minBid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Reserve Price</span>
            <span className={`text-sm font-medium ${
              auction.reserveMet ? 'text-green-400' : 'text-red-400'
            }`}>
              {auction.reserveMet ? 'Met' : 'Not Met'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Bid Buttons */}
      <div className="mb-4 sm:mb-6">
        <div className="text-sm text-gray-400 mb-3">Quick Bid Amounts</div>
        <div className="grid grid-cols-2 gap-2">
          {suggestedBids.map((amount) => (
            <button
              key={amount}
              onClick={() => setBidAmount(amount.toString())}
              className="bg-[#232326] hover:bg-orange-500 active:bg-orange-600 text-white py-2 px-3 sm:px-4 rounded-lg transition touch-manipulation text-sm sm:text-base"
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Bid Amount Input */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Your Bid Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              onBlur={() => validateBid(bidAmount)}
              className={`w-full bg-[#232326] border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base ${
                errors.bidAmount ? 'border-red-500' : 'border-[#333]'
              }`}
              placeholder={minBid.toLocaleString()}
              min={minBid}
              step="0.01"
            />
          </div>
          {errors.bidAmount && (
            <p className="text-red-400 text-xs mt-1">{errors.bidAmount}</p>
          )}
        </div>

        {/* Advanced Options Toggle - Mobile */}
        <div className="mb-4 sm:hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-orange-400 text-sm font-medium flex items-center gap-1"
          >
            Advanced Options
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Proxy Bidding Option */}
        <div className={`mb-4 ${showAdvanced ? 'block' : 'hidden sm:block'}`}>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={isProxyBid}
              onChange={(e) => setIsProxyBid(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
            />
            <div className="ml-3">
              <span className="text-gray-300 text-sm">
                Enable Automatic Bidding (Proxy Bid)
              </span>
              <p className="text-xs text-gray-400 mt-1">
                We&apos;ll bid on your behalf up to your maximum amount
              </p>
            </div>
          </label>
        </div>

        {/* Max Bid Input (shown when proxy bidding is enabled) */}
        {isProxyBid && (
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Maximum Bid Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value)}
                className={`w-full bg-[#232326] border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base ${
                  errors.maxBid ? 'border-red-500' : 'border-[#333]'
                }`}
                placeholder="Enter your maximum bid"
                step="0.01"
              />
            </div>
            {errors.maxBid && (
              <p className="text-red-400 text-xs mt-1">{errors.maxBid}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !bidAmount}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition touch-manipulation text-sm sm:text-base"
        >
          {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
        </button>

        {errors.submit && (
          <p className="text-red-400 text-sm mt-2 text-center">{errors.submit}</p>
        )}
      </form>

      {/* Bidding Terms - Collapsible on Mobile */}
      <div className="mt-4 sm:mt-6">
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-white mb-2 flex items-center justify-between">
            Bidding Terms
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-3 sm:p-4 bg-[#232326] rounded-lg">
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• All bids are binding and cannot be retracted</li>
              <li>• You agree to complete purchase if you win</li>
              <li>• Payment is due within 48 hours of auction end</li>
              <li>• Shipping costs are additional to winning bid</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}

// Mobile-optimized Image Gallery Component
function ImageGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-[#232326] rounded-lg sm:rounded-xl overflow-hidden">
        <img
          src={images[selectedImage] || '/placeholder-auction.jpg'}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs sm:text-sm">
          {selectedImage + 1} / {images.length}
        </div>
        
        {/* Mobile Navigation Arrows */}
        <div className="sm:hidden absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button
            onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
            className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
            className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Thumbnail Grid - Hidden on mobile, visible on larger screens */}
      <div className="hidden sm:grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-[#232326] rounded-lg overflow-hidden border-2 transition touch-manipulation ${
              selectedImage === index ? 'border-orange-500' : 'border-transparent hover:border-gray-500'
            }`}
          >
            <img
              src={image || '/placeholder-auction.jpg'}
              alt={`${title} view ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      
      {/* Mobile Dot Indicators */}
      <div className="flex justify-center gap-2 sm:hidden">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-2 h-2 rounded-full transition ${
              selectedImage === index ? 'bg-orange-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Mobile-optimized Bid History Component
function BidHistory({ bidHistory }) {
  const [showAll, setShowAll] = useState(false)
  const displayHistory = showAll ? bidHistory : bidHistory.slice(0, 3)

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Bid History</h3>
      <div className="space-y-2 sm:space-y-3">
        {displayHistory.map((bid, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-[#232326] last:border-b-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${bid.isWinning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300 text-sm sm:text-base truncate">{bid.bidder}</span>
              {bid.isWinning && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded flex-shrink-0">Winning</span>}
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="font-semibold text-white text-sm sm:text-base">${bid.amount.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{bid.time}</div>
            </div>
          </div>
        ))}
      </div>
      
      {bidHistory.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 text-orange-400 hover:text-orange-300 text-sm font-medium transition"
        >
          {showAll ? 'Show Less' : `Show All ${bidHistory.length} Bids`}
        </button>
      )}
    </div>
  )
}

// Mobile-optimized Seller Info Component  
function SellerInfo({ seller }) {
  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Seller Information</h3>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
          {seller.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm sm:text-base truncate">{seller.name}</h4>
            {seller.verified && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2">
            <span>⭐ {seller.rating}/5.0</span>
            <span>{seller.totalSales} sales</span>
            <span>Joined {seller.joinedDate}</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">{seller.location}</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#232326]">
        <Link href={`/sellers/${seller.name}`} className="text-orange-400 hover:text-orange-300 text-sm font-medium">
          View Seller Profile →
        </Link>
      </div>
    </div>
  )
}

// Main Page Component
export default function AuctionDetailPage() {
  const params = useParams()
  const auction = getAuctionById(params.id)
  const [showBidSuccess, setShowBidSuccess] = useState(false)

  const handleBidSubmit = (bidData) => {
    console.log('Bid submitted:', bidData)
    setShowBidSuccess(true)
    setTimeout(() => setShowBidSuccess(false), 5000)
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Auction Not Found</h1>
          <Link href="/auctions" className="text-orange-400 hover:text-orange-300">
            ← Back to Auctions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* Bid Success Notification */}
      {showBidSuccess && (
        <div className="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto sm:w-auto bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm sm:text-base">Bid placed successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 overflow-x-auto">
            <Link href="/" className="hover:text-orange-400 whitespace-nowrap">Home</Link>
            <span className="flex-shrink-0">/</span>
            <Link href="/auctions" className="hover:text-orange-400 whitespace-nowrap">Auctions</Link>
            <span className="flex-shrink-0">/</span>
            <span className="text-white truncate">{auction.title}</span>
          </div>
        </nav>

        {/* Mobile: Stacked Layout, Desktop: Grid Layout */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={auction.images} title={auction.title} />

            {/* Item Description */}
            <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{auction.title}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{auction.description}</p>
              </div>

              {/* Specifications */}
              <div className="mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Specifications</h3>
                <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  {Object.entries(auction.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between sm:flex-col sm:justify-start py-2 border-b border-[#232326] sm:border-b-0">
                      <span className="text-gray-400 text-sm">{key}</span>
                      <span className="text-white font-medium text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="mt-6 pt-6 border-t border-[#232326]">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Shipping: ${auction.shipping.cost} (Standard)</p>
                  <p>• International shipping available</p>
                  <p>• 7-day return policy for authenticity issues</p>
                  <p>• Fully insured shipping with tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bidding and Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Countdown Timer */}
            <CountdownTimer endTime={auction.endTime} />

            {/* Bid Form */}
            <BidForm auction={auction} onBidSubmit={handleBidSubmit} />

            {/* Seller Info */}
            <SellerInfo seller={auction.seller} />

            {/* Bid History */}
            <BidHistory bidHistory={auction.bidHistory} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
