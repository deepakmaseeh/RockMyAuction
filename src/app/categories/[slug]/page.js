'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuctionCard from '@/components/AuctionCard'
import auctionAPI from '@/lib/auctionAPI'

export default function CategoryPage() {
  const params = useParams()
  const { slug } = params
  
  const [category, setCategory] = useState(null)
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        
        // Try to fetch category by ID first
        let categoryData = null
        let auctionsData = []
        
        try {
          // If slug is a valid ID, fetch by ID
          if (!isNaN(slug)) {
            categoryData = await auctionAPI.getCategory(slug)
            auctionsData = await auctionAPI.getCategoryAuctions(slug)
          } else {
            // Otherwise, fetch all categories and find by slug
            const allCategories = await auctionAPI.getCategories()
            categoryData = allCategories.find(cat => {
              const catSlug = (cat.name || cat.label || '').toLowerCase().replace(/\s+/g, '-')
              return catSlug === slug
            })
            
            if (categoryData) {
              auctionsData = await auctionAPI.getCategoryAuctions(categoryData.id)
            }
          }
        } catch (err) {
          console.error('Error fetching category:', err)
          // If API fails, create a fallback category based on the slug
          categoryData = {
            name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            id: slug
          }
        }
        
        if (!categoryData) {
          throw new Error('Category not found')
        }
        
        // Process auctions to add endTime
        const now = new Date()
        auctionsData.forEach(auction => {
          const endDate = new Date(auction.endDate)
          
          if (endDate > now) {
            // Calculate time remaining
            const timeRemaining = endDate - now
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
            
            auction.endTime = `in ${hours}h ${minutes}m`
          } else {
            // Calculate days since ended
            const daysSince = Math.floor((now - endDate) / (1000 * 60 * 60 * 24))
            auction.endTime = daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`
            auction.ended = true
          }
        })
        
        // Sort auctions by end date (active first, then recently ended)
        auctionsData.sort((a, b) => {
          if ((a.ended && b.ended) || (!a.ended && !b.ended)) {
            return new Date(a.endDate) - new Date(b.endDate)
          }
          return a.ended ? 1 : -1
        })
        
        setCategory(categoryData)
        setAuctions(auctionsData)
        setError(null)
      } catch (err) {
        console.error('Error loading category page:', err)
        setError(err.message || 'Failed to load category data')
      } finally {
        setLoading(false)
      }
    }
    
    if (slug) {
      fetchCategoryData()
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-[#232326] rounded-2xl shadow p-4 h-64">
                  <div className="bg-gray-700 h-40 rounded-xl mb-3"></div>
                  <div className="bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">{category?.name || 'Category'}</h1>
            
            {auctions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {auctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    image={auction.image}
                    title={auction.title}
                    currentBid={auction.currentBid}
                    endTime={auction.endTime}
                    users={auction.users || auction.bidCount || 0}
                    slug={auction.slug || auction.id}
                    type={auction.ended ? 'ended' : 'active'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#232326] rounded-xl">
                <h2 className="text-xl font-semibold mb-2">No auctions found</h2>
                <p className="text-gray-400">There are currently no auctions in this category.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="py-6 sm:py-8 mt-8 sm:mt-10 text-center text-gray-400 text-sm">
        <Footer />
      </footer>
    </div>
  )
}