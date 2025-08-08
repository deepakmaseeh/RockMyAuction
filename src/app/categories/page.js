'use client'

import { useState, useEffect } from 'react'
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
  "Toys": "🧸"
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        
        // Fetch categories from API
        const categoriesData = await auctionAPI.getCategories()
        
        // Map categories to include icons
        const categoriesWithIcons = categoriesData.map(category => ({
          ...category,
          icon: <span>{categoryIcons[category.name] || "🏷️"}</span>
        }))
        
        setCategories(categoriesWithIcons)
        setError(null)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories. Please try again later.')
        
        // Set fallback data if API fails
        setCategories([
          { name: "Memorabilia", icon: <span>🎤</span> },
          { name: "Watches", icon: <span>⌚</span> },
          { name: "Comics", icon: <span>📚</span> },
          { name: "Fine Art", icon: <span>🖼️</span> },
          { name: "Rare Shoes", icon: <span>👟</span> }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Categories</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-[#232326] px-6 py-8 rounded-xl flex flex-col items-center justify-center animate-pulse">
                <div className="bg-gray-700 h-10 w-10 rounded-full mb-3"></div>
                <div className="bg-gray-700 h-4 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 rounded-lg bg-red-900/20">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id || category.name}
                id={category.id}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="py-6 sm:py-8 mt-8 sm:mt-10 text-center text-gray-400 text-sm">
        <Footer />
      </footer>
    </div>
  )
}