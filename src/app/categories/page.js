'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CategoryCard from '@/components/CategoryCard'
import auctionAPI from '@/lib/auctionAPI'

// Default category icons mapping
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

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching auctions to extract categories...')
        
        // ✅ FIXED: Get auctions first, then extract unique categories
        const auctionsData = await auctionAPI.getAuctions()
        
        console.log('📊 Auctions data received:', auctionsData)

        // Extract unique categories from auctions
        const uniqueCategories = new Set()
        const categoryData = []

        if (Array.isArray(auctionsData)) {
          // If auctionsData is an array
          auctionsData.forEach(auction => {
            if (auction.category && !uniqueCategories.has(auction.category)) {
              uniqueCategories.add(auction.category)
              categoryData.push({
                id: auction.category.toLowerCase().replace(/\s+/g, '-'),
                name: auction.category,
                icon: <span>{categoryIcons[auction.category] || "🏷️"}</span>,
                count: auctionsData.filter(a => a.category === auction.category).length
              })
            }
          })
        } else if (auctionsData && auctionsData.auctions) {
          // If auctionsData has auctions property
          auctionsData.auctions.forEach(auction => {
            if (auction.category && !uniqueCategories.has(auction.category)) {
              uniqueCategories.add(auction.category)
              categoryData.push({
                id: auction.category.toLowerCase().replace(/\s+/g, '-'),
                name: auction.category,
                icon: <span>{categoryIcons[auction.category] || "🏷️"}</span>,
                count: auctionsData.auctions.filter(a => a.category === auction.category).length
              })
            }
          })
        }

        // ✅ FIXED: If no categories found from API, use fallback data
        if (categoryData.length === 0) {
          console.log('⚠️ No categories found in API, using fallback data')
          const fallbackCategories = [
            { id: 'memorabilia', name: 'Memorabilia', icon: <span>🎤</span>, count: 15 },
            { id: 'watches', name: 'Watches', icon: <span>⌚</span>, count: 23 },
            { id: 'comics', name: 'Comics', icon: <span>📚</span>, count: 8 },
            { id: 'fine-art', name: 'Fine Art', icon: <span>🖼️</span>, count: 12 },
            { id: 'rare-shoes', name: 'Rare Shoes', icon: <span>👟</span>, count: 19 },
            { id: 'collectibles', name: 'Collectibles', icon: <span>🏆</span>, count: 34 },
            { id: 'jewelry', name: 'Jewelry', icon: <span>💍</span>, count: 27 },
            { id: 'vintage', name: 'Vintage', icon: <span>🕰️</span>, count: 16 },
            { id: 'sports', name: 'Sports', icon: <span>⚽</span>, count: 21 },
            { id: 'technology', name: 'Technology', icon: <span>💻</span>, count: 18 },
            { id: 'fashion', name: 'Fashion', icon: <span>👗</span>, count: 25 },
            { id: 'music', name: 'Music', icon: <span>🎸</span>, count: 14 }
          ]
          setCategories(fallbackCategories)
        } else {
          setCategories(categoryData)
        }

        console.log('✅ Categories processed successfully:', categoryData)
        
      } catch (err) {
        console.error('❌ Error fetching categories:', err)
        setError('Failed to load categories. Showing default categories.')
        
        // Set fallback data if API fails
        const fallbackCategories = [
          { id: 'memorabilia', name: 'Memorabilia', icon: <span>🎤</span>, count: 15 },
          { id: 'watches', name: 'Watches', icon: <span>⌚</span>, count: 23 },
          { id: 'comics', name: 'Comics', icon: <span>📚</span>, count: 8 },
          { id: 'fine-art', name: 'Fine Art', icon: <span>🖼️</span>, count: 12 },
          { id: 'rare-shoes', name: 'Rare Shoes', icon: <span>👟</span>, count: 19 },
          { id: 'collectibles', name: 'Collectibles', icon: <span>🏆</span>, count: 34 },
          { id: 'jewelry', name: 'Jewelry', icon: <span>💍</span>, count: 27 },
          { id: 'vintage', name: 'Vintage', icon: <span>🕰️</span>, count: 16 },
          { id: 'sports', name: 'Sports', icon: <span>⚽</span>, count: 21 },
          { id: 'technology', name: 'Technology', icon: <span>💻</span>, count: 18 },
          { id: 'fashion', name: 'Fashion', icon: <span>👗</span>, count: 25 },
          { id: 'music', name: 'Music', icon: <span>🎸</span>, count: 14 }
        ]
        setCategories(fallbackCategories)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  // ✅ ADDED: Handle category click to show related auctions
  const handleCategoryClick = (categoryId, categoryName) => {
    console.log('🔍 Category clicked:', { categoryId, categoryName })
    
    // Navigate to auctions page with category filter
    router.push(`/auctions?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">All Categories</h1>
          <p className="text-gray-400 text-lg">
            Discover amazing items across all our auction categories
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-400 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
              <div key={i} className="bg-[#232326] px-6 py-8 rounded-xl flex flex-col items-center justify-center animate-pulse">
                <div className="bg-gray-700 h-10 w-10 rounded-full mb-3"></div>
                <div className="bg-gray-700 h-4 rounded w-20 mb-2"></div>
                <div className="bg-gray-700 h-3 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id, category.name)}
                  className="bg-[#18181B] hover:bg-[#232326] border border-[#232326] hover:border-orange-500/20 px-4 sm:px-6 py-6 sm:py-8 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-105 group"
                >
                  {/* Category Icon */}
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-semibold text-white text-sm sm:text-base text-center mb-2 group-hover:text-orange-400 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Item Count */}
                  {category.count && (
                    <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {category.count} items
                    </p>
                  )}
                  
                  {/* Click indicator */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Summary */}
            <div className="mt-12 bg-[#18181B] rounded-xl p-6 border border-[#232326]">
              <h2 className="text-xl font-bold mb-4">Categories Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-orange-400">{categories.length}</div>
                  <div className="text-sm text-gray-400">Categories</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-400">Total Items</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-400">Live</div>
                  <div className="text-sm text-gray-400">Auctions</div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="py-6 sm:py-8 mt-8 sm:mt-10 text-center text-gray-400 text-sm">
        <Footer />
      </footer>
    </div>
  )
}
