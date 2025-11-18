'use client'

import { useState } from 'react'
import { useWatchlist } from '@/contexts/WishlistContext'

export default function WishlistButton({ auction, auctionId, size = 'md', className = '' }) {
  const watchlistContext = useWatchlist()
  const [animating, setAnimating] = useState(false)
  
  // Use auctionId if provided, otherwise get from auction object
  const id = auctionId || auction?._id || auction?.id
  
  // Safe access to context with fallback
  const isInWatchlist = watchlistContext?.isInWatchlist || (() => false)
  const toggleWatchlist = watchlistContext?.toggleWatchlist || (async () => false)
  
  const inWatchlist = id ? isInWatchlist(id) : false

  const handleClick = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (!id) {
      console.error('No auction ID provided to WishlistButton')
      return
    }
    
    setAnimating(true)
    
    // ✅ Pass full auction object if available, otherwise just ID
    const success = await toggleWatchlist(auction || id)
    
    if (success) {
      setTimeout(() => setAnimating(false), 300)
    } else {
      setAnimating(false)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-9 h-9 p-2', 
    lg: 'w-10 h-10 p-2.5'
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  }

  // Always render the button, even if id is missing (for debugging)
  if (!id) {
    console.warn('WishlistButton: No auction ID provided', { auction, auctionId })
  }

  return (
    <button
      onClick={handleClick}
      disabled={!id}
      className={`
        ${sizeClasses[size]}
        ${className}
        ${animating ? 'animate-pulse scale-125' : ''}
        ${!id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${inWatchlist 
          ? 'bg-orange-500/40 text-orange-400 hover:bg-orange-500/50 border-2 border-orange-500/70' 
          : 'bg-white/95 text-gray-700 hover:bg-white hover:text-red-500 border-2 border-gray-400/60'
        }
        rounded-full transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl z-10
      `}
      title={!id ? 'Auction ID missing' : (inWatchlist ? 'Remove from wishlist' : 'Add to wishlist')}
      aria-label={!id ? 'Auction ID missing' : (inWatchlist ? 'Remove from wishlist' : 'Add to wishlist')}
    >
      <svg
        className={iconSizes[size]}
        fill={inWatchlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={inWatchlist ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
