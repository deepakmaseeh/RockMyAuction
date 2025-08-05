'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

// Mock data (self-contained to avoid import errors)
const mockAuctions = [
  {
    id: 1,
    title: "Vintage Rolex Datejust Third Hand",
    image: "/assets/PB-4.jpg",
    currentBid: 2550,
    timeLeft: "2h 30m",
    status: "LIVE NOW",
    bids: 45,
    seller: "LuxuryTimepieces",
    category: "Watches",
    endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: "KAWS Companion (Flayed) Limited Edition",
    image: "/assets/PB-3.jpg",
    currentBid: 850,
    timeLeft: "4h 15m",
    status: "LIVE NOW",
    bids: 22,
    seller: "ArtCollective",
    category: "Art",
    endTime: new Date(Date.now() + 4.25 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: "Air Jordan 1 Retro High OG Chicago",
    image: "/assets/PB-3.jpg",
    currentBid: 1200,
    timeLeft: "1h 45m",
    status: "LIVE NOW",
    bids: 67,
    seller: "SneakerVault",
    category: "Sneakers",
    endTime: new Date(Date.now() + 1.75 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: "First Edition Harry Potter & Philosopher's Stone",
    image: "/assets/PB-3.jpg",
    currentBid: 3500,
    timeLeft: "6h 20m",
    status: "LIVE NOW",
    bids: 38,
    seller: "RareBooksCollector",
    category: "Books",
    endTime: new Date(Date.now() + 6.33 * 60 * 60 * 1000)
  },
  {
    id: 5,
    title: "1960 Topps Mickey Mantle Baseball Card",
    image: "/assets/PB-3.jpg",
    currentBid: 4200,
    timeLeft: "3h 10m",
    status: "LIVE NOW",
    bids: 89,
    seller: "SportsCardsDepot",
    category: "Sports Cards",
    endTime: new Date(Date.now() + 3.17 * 60 * 60 * 1000)
  },
  {
    id: 6,
    title: "Vintage 1961 Fender Stratocaster",
    image: "/assets/PB-2.jpg",
    currentBid: 15500,
    timeLeft: "8h 45m",
    status: "LIVE NOW",
    bids: 156,
    seller: "VintageGuitars",
    category: "Musical Instruments",
    endTime: new Date(Date.now() + 8.75 * 60 * 60 * 1000)
  },
  {
    id: 7,
    title: "Abstract Kinetic Sculpture by Arya",
    image: "/assets/PB-3.jpg",
    currentBid: 2800,
    timeLeft: "5h 30m",
    status: "LIVE NOW",
    bids: 34,
    seller: "ModernArtStudy",
    category: "Sculpture",
    endTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000)
  },
  {
    id: 8,
    title: "Penny Black 1840 Stamp (Mint Condition)",
    image: "/assets/PB-2.jpg",
    currentBid: 6800,
    timeLeft: "12h 15m",
    status: "LIVE NOW",
    bids: 92,
    seller: "PhilatelyCorner",
    category: "Stamps",
    endTime: new Date(Date.now() + 12.25 * 60 * 60 * 1000)
  }
]

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

// Inline AuctionCard Component (to avoid import errors)
function AuctionCard({ auction }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(auction.endTime).getTime()
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
  }, [auction.endTime])

  const isUrgent = timeLeft.includes('m') && !timeLeft.includes('h') && parseInt(timeLeft) < 30
  const isEnded = timeLeft === 'ENDED'

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#232326] hover:border-orange-500/30 transition-all duration-300 group overflow-hidden">
      {/* Status Badge */}
      <div className="relative">
        <img
          src={auction.image || '/placeholder-auction.jpg'}
          alt={auction.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            isEnded ? 'bg-gray-500 text-white' : 
            isUrgent ? 'bg-red-500 text-white animate-pulse' : 
            'bg-green-500 text-white'
          }`}>
            {isEnded ? 'ENDED' : auction.status}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
          {auction.bids} bids
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
          {auction.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-orange-400">
              ${auction.currentBid.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Current Bid</div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}
            </div>
            <div className="text-xs text-gray-400">Time Left</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {auction.seller.charAt(0)}
            </div>
            <span className="text-sm text-gray-400">{auction.seller}</span>
          </div>
          <span className="text-xs bg-[#232326] text-gray-300 px-2 py-1 rounded">
            {auction.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/auctions/${auction.id}`}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-center transition ${
              isEnded 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isEnded ? 'View Results' : 'Place Bid'}
          </Link>
          <button className="p-2 bg-[#232326] hover:bg-[#2a2a2e] text-gray-300 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Inline SearchFilters Component (to avoid import errors)
function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories
}) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
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

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none appearance-none cursor-pointer"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="ending-soon">Ending Soon</option>
          <option value="highest-bid">Highest Bid</option>
          <option value="most-bids">Most Bids</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  )
}

// Inline SimpleNavbar Component (to avoid import errors if you don't have one)
function SimpleNavbar() {
  return (
    <nav className="bg-[#18181B] border-b border-[#232326]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <span>🏺</span>
            Rock the Auction
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-orange-400 transition">Home</Link>
            <Link href="/auctions" className="text-orange-400 font-medium">Auctions</Link>
            <Link href="/about" className="text-gray-300 hover:text-orange-400 transition">About</Link>
            <Link href="/auth/login" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Inline SimpleFooter Component (to avoid import errors if you don't have one)
function SimpleFooter() {
  return (
    <footer className="bg-[#18181B] border-t border-[#232326] py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">© 2024 Rock the Auction. All rights reserved.</p>
      </div>
    </footer>
  )
}

// Main Auctions Page Component
export default function AuctionsPage() {
  const [auctions, setAuctions] = useState(mockAuctions)
  const [filteredAuctions, setFilteredAuctions] = useState(mockAuctions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('ending-soon')

  // Filter and search functionality
  useEffect(() => {
    let filtered = auctions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.seller.toLowerCase().includes(searchTerm.toLowerCase())
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
          return a.endTime - b.endTime
        case 'highest-bid':
          return b.currentBid - a.currentBid
        case 'most-bids':
          return b.bids - a.bids
        case 'newest':
          return b.id - a.id
        default:
          return 0
      }
    })

    setFilteredAuctions(filtered)
  }, [searchTerm, selectedCategory, sortBy, auctions])

  const categories = ['All', 'Watches', 'Art', 'Sneakers', 'Books', 'Sports Cards', 'Musical Instruments', 'Sculpture', 'Stamps']

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* Featured Auction Hero */}
      <section className="relative h-[500px] bg-gradient-to-r from-red-900/20 to-orange-900/20 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${featuredAuction.image})` }}
        />
        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
            FEATURED AUCTION
          </div>
          <h1 className="text-5xl font-bold mb-4">{featuredAuction.title}</h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            {featuredAuction.description}
          </p>
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">${featuredAuction.currentBid.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Current Bid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{featuredAuction.timeLeft}</div>
              <div className="text-sm text-gray-400">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{featuredAuction.bids}</div>
              <div className="text-sm text-gray-400">Bids</div>
            </div>
          </div>
          <Link 
            href={`/auctions/${featuredAuction.id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition inline-block"
          >
            View Auction Details
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-6 py-8">
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

      {/* Live Auctions Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Live Auctions</h2>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{filteredAuctions.length} Live Auctions</span>
          </div>
        </div>

        {filteredAuctions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No auctions found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => alert('Load more functionality would be implemented here')}
            className="bg-[#18181B] border border-[#232326] hover:border-orange-500 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Load More Auctions
          </button>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-[#18181B] py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Stay up-to-date with exclusive drops!</h2>
          <p className="text-gray-400 mb-8">Get notified about the latest auctions and never miss a deal.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
            <button 
              onClick={() => alert('Newsletter signup would be implemented here')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

     <Footer/>
    </div>
  )
}
