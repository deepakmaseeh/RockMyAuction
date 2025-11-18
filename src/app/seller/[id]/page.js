'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import auctionAPI from '@/lib/auctionAPI'

export default function SellerProfilePage() {
  const router = useRouter()
  const params = useParams()
  const sellerId = params.id

  const [seller, setSeller] = useState(null)
  const [sellerAuctions, setSellerAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  // Fetch seller data and auctions
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true)
        
        // Fetch seller profile (you'll need to add this API method)
        // const sellerData = await auctionAPI.getSellerProfile(sellerId)
        
        // Mock seller data for now - replace with actual API call
        const mockSellerData = {
          _id: sellerId,
          name: 'Alex Thompson',
          email: 'alex@example.com',
          avatar: null,
          bio: 'Passionate collector of vintage watches and rare collectibles. Been trading on Rock My Auction for over 3 years with 98% positive feedback.',
          location: 'New York, NY',
          website: 'https://alexcollects.com',
          joinDate: '2022-01-15',
          stats: {
            totalSales: 145,
            totalRevenue: 28450,
            rating: 4.8,
            reviewCount: 234,
            successRate: 94,
            responseTime: '< 2 hours',
            totalAuctions: 168
          },
          verifications: {
            email: true,
            phone: true,
            identity: true,
            address: false
          }
        }
        
        setSeller(mockSellerData)

        // Fetch seller's auctions
        const auctionsData = await auctionAPI.getAuctions({ seller: sellerId })
        // Handle both array format and object with data property (backend returns {success: true, data: [...], pagination: {...}})
        const auctionsList = Array.isArray(auctionsData) ? auctionsData : (auctionsData.data || auctionsData.auctions || [])
        setSellerAuctions(auctionsList)

      } catch (err) {
        console.error('Failed to load seller data:', err)
        setError('Failed to load seller profile.')
      } finally {
        setLoading(false)
      }
    }

    if (sellerId) {
      fetchSellerData()
    }
  }, [sellerId])

  const getActiveAuctions = () => {
    return sellerAuctions.filter(auction => {
      const endDate = new Date(auction.endDate)
      const now = new Date()
      return endDate > now
    })
  }

  const getCompletedAuctions = () => {
    return sellerAuctions.filter(auction => {
      const endDate = new Date(auction.endDate)
      const now = new Date()
      return endDate <= now
    })
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl font-bold mb-2">Seller Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'This seller profile could not be found.'}</p>
            <button 
              onClick={() => router.back()}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const displayedAuctions = activeTab === 'active' ? getActiveAuctions() : getCompletedAuctions()

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Auction
        </button>

        {/* Seller Header Card */}
        <div className="bg-[#18181B] rounded-2xl p-6 sm:p-8 border border-[#232326] mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative self-center sm:self-start">
              {seller.avatar ? (
                <img 
                  src={seller.avatar} 
                  alt={seller.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
                />
              ) : (
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-orange-400">
                  {getInitials(seller.name)}
                </div>
              )}
              {/* Online Status */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-[#18181B] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Seller Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold">{seller.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-orange-400">
                  <span>⭐</span>
                  <span className="font-semibold text-lg">{seller.stats.rating}</span>
                  <span className="text-gray-400 text-sm">({seller.stats.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">{seller.bio}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{seller.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>Since {new Date(seller.joinDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>✅</span>
                  <span>{seller.stats.successRate}% success</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⚡</span>
                  <span>{seller.stats.responseTime}</span>
                </div>
              </div>

              {/* Verification Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {seller.verifications.email && (
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                    ✉️ Email Verified
                  </span>
                )}
                {seller.verifications.phone && (
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                    📱 Phone Verified
                  </span>
                )}
                {seller.verifications.identity && (
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                    🆔 ID Verified
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                  Contact Seller
                </button>
                <button className="bg-[#232326] hover:bg-[#2a2a2e] text-white px-6 py-2 rounded-lg font-semibold transition">
                  Follow Seller
                </button>
                {seller.website && (
                  <a 
                    href={seller.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition text-center"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
              {seller.stats.totalSales}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Items Sold</div>
          </div>
          
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
              {seller.stats.totalAuctions}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Total Auctions</div>
          </div>
          
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-xl sm:text-3xl font-bold text-orange-400 mb-1">
              ${seller.stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Total Revenue</div>
          </div>
          
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
              {seller.stats.rating}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Average Rating</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#18181B] rounded-xl border border-[#232326] mb-8">
          <div className="flex border-b border-[#232326] overflow-x-auto">
            {[
              { key: 'active', label: `Active Auctions (${getActiveAuctions().length})`, icon: '🔥' },
              { key: 'completed', label: `Completed (${getCompletedAuctions().length})`, icon: '✅' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.key
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {displayedAuctions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">
                  {activeTab === 'active' ? '🔍' : '📦'}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No {activeTab} auctions
                </h3>
                <p className="text-gray-400">
                  {activeTab === 'active' 
                    ? 'This seller has no active auctions at the moment.'
                    : 'This seller has no completed auctions yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayedAuctions.map(auction => (
                  <div
                    key={auction._id || auction.id}
                    onClick={() => router.push(`/auctions/${auction._id || auction.id}`)}
                    className="bg-[#232326] rounded-lg overflow-hidden cursor-pointer hover:bg-[#2a2a2e] transition group"
                  >
                    {auction.images?.[0] && (
                      <img
                        src={auction.images[0]}
                        alt={auction.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-orange-400 transition">
                        {auction.title}
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-orange-400 font-bold">
                          ${(auction.currentBid || auction.startingPrice || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {auction.bidCount || 0} bids
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {activeTab === 'active' 
                          ? `Ends: ${new Date(auction.endDate).toLocaleDateString()}`
                          : `Ended: ${new Date(auction.endDate).toLocaleDateString()}`
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trust & Safety Section */}
        <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🛡️</span>
            Trust & Safety
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-orange-400">Seller Protection</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Verified seller since {new Date(seller.joinDate).getFullYear()}</li>
                <li>• {seller.stats.successRate}% successful transaction rate</li>
                <li>• Average response time: {seller.stats.responseTime}</li>
                <li>• {seller.stats.reviewCount} verified reviews</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-400">Buyer Protection</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Money-back guarantee</li>
                <li>• Secure payment processing</li>
                <li>• Item authenticity protection</li>
                <li>• 24/7 dispute resolution support</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
