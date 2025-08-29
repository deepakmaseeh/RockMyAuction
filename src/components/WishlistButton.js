'use client'

import { useState } from 'react'
import { useWatchlist } from '@/contexts/WishlistContext'

export default function WishlistButton({ auction, auctionId, size = 'md', className = '' }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const [animating, setAnimating] = useState(false)
  
  // Use auctionId if provided, otherwise get from auction object
  const id = auctionId || auction?._id || auction?.id
  const inWatchlist = isInWatchlist(id)

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
    sm: 'w-4 h-4 p-1',
    md: 'w-5 h-5 p-2', 
    lg: 'w-6 h-6 p-3'
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${className}
        ${animating ? 'animate-pulse scale-125' : ''}
        ${inWatchlist 
          ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' 
          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/60 hover:text-orange-400'
        }
        rounded-full transition-all duration-200 flex items-center justify-center
      `}
      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg
        className="w-full h-full"
        fill={inWatchlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={inWatchlist ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
  )
}
