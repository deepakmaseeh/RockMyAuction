'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import auctionAPI from '@/lib/auctionAPI'
import { useUserRole } from './RoleContext'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useUserRole()
  const [watchlistItems, setWatchlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Memoize loadWatchlist to prevent infinite loops
  const loadWatchlist = useCallback(async () => {
    if (!isAuthenticated || !user) return
    setLoading(true)
    try {
      const response = await auctionAPI.getWishlist()
      const items = response?.data || response || []
      
      // Transform API data - handle both formats
      const formattedItems = items.map(item => {
        const auction = item.auction || item
        return {
          id: auction._id || auction.id,
          _id: auction._id || auction.id,
          title: auction.title,
          images: auction.images || [],
          imageUrl: auction.imageUrl || auction.images?.[0] || '',
          currentBid: auction.currentBid || auction.startingPrice || 0,
          startingPrice: auction.startingPrice || 0,
          endDate: auction.endDate,
          status: new Date(auction.endDate) > new Date() ? 'LIVE' : 'ENDED',
          bids: auction.bidCount || auction.bids?.length || 0,
          seller: auction.seller?.name || auction.seller || 'Unknown Seller',
          category: auction.category || 'General',
          highestBid: 0,
          isWinning: false,
          watchedSince: item.addedAt || new Date().toLocaleDateString(),
          finalResult: new Date(auction.endDate) <= new Date() ? 'UNKNOWN' : null
        }
      })
      
      setWatchlistItems(formattedItems)
    } catch (e) {
      console.error('Failed to load watchlist:', e)
      setWatchlistItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  // Load watchlist when user logs in (only once)
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWatchlist()
    } else {
      setWatchlistItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?._id]) // Only depend on user ID, not the whole user object

  const addToWatchlist = async (auctionData) => {
    if (!isAuthenticated || !user) {
      alert('Please login to add to watchlist')
      return false
    }
    
    try {
      // Accept either auctionId or full auction object
      const auctionId = typeof auctionData === 'string' ? auctionData : auctionData._id || auctionData.id
      
      if (!auctionId) {
        console.error('No auction ID provided')
        return false
      }

      const response = await auctionAPI.addToWishlist(auctionId)
      
      if (response.success) {
        // If full auction object provided, add it immediately to state
        if (typeof auctionData === 'object' && auctionData._id) {
          const formattedItem = {
            id: auctionData._id || auctionData.id,
            _id: auctionData._id || auctionData.id,
            title: auctionData.title,
            images: auctionData.images || [],
            imageUrl: auctionData.imageUrl || auctionData.images?.[0] || '',
            currentBid: auctionData.currentBid || auctionData.startingPrice || 0,
            startingPrice: auctionData.startingPrice || 0,
            endDate: auctionData.endDate,
            status: new Date(auctionData.endDate) > new Date() ? 'LIVE' : 'ENDED',
            bids: auctionData.bidCount || auctionData.bids?.length || 0,
            seller: auctionData.seller?.name || auctionData.seller || 'Unknown Seller',
            category: auctionData.category || 'General',
            highestBid: 0,
            isWinning: false,
            watchedSince: 'Just added',
            finalResult: new Date(auctionData.endDate) <= new Date() ? 'UNKNOWN' : null
          }
          
          setWatchlistItems(prev => {
            // Check if already exists
            if (prev.some(item => item.id === formattedItem.id)) {
              return prev
            }
            return [...prev, formattedItem]
          })
        } else {
          // Reload from API if only ID provided
          await loadWatchlist()
        }
        
        return true
      } else {
        throw new Error(response.error || 'Failed to add to wishlist')
      }
    } catch (e) {
      console.error('Add to watchlist failed:', e)
      alert(e.message || 'Failed to add to watchlist')
      return false
    }
  }

  const removeFromWatchlist = async (auctionId) => {
    if (!isAuthenticated || !user) return false
    
    try {
      const response = await auctionAPI.removeFromWishlist(auctionId)
      
      if (response.success) {
        setWatchlistItems(prev => prev.filter(item => {
          const itemId = item.id || item._id
          const targetId = auctionId
          return itemId !== targetId && itemId?.toString() !== targetId?.toString()
        }))
        return true
      } else {
        throw new Error(response.error || 'Failed to remove from wishlist')
      }
    } catch (e) {
      console.error('Remove from watchlist failed:', e)
      alert(e.message || 'Failed to remove from watchlist')
      return false
    }
  }

  const isInWatchlist = (auctionId) => {
    if (!auctionId) return false
    return watchlistItems.some(item => {
      const itemId = item.id || item._id
      const targetId = auctionId
      return itemId === targetId || itemId?.toString() === targetId?.toString()
    })
  }

  const toggleWatchlist = async (auctionData) => {
    const auctionId = typeof auctionData === 'string' ? auctionData : auctionData._id || auctionData.id
    
    if (isInWatchlist(auctionId)) {
      return await removeFromWatchlist(auctionId)
    } else {
      return await addToWatchlist(auctionData)
    }
  }

  return (
    <WishlistContext.Provider value={{
      watchlistItems,
      loading,
      watchlistCount: watchlistItems.length,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      toggleWatchlist,
      loadWatchlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWatchlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    // Return a default context if not within provider (for graceful degradation)
    return {
      watchlistItems: [],
      loading: false,
      watchlistCount: 0,
      addToWatchlist: async () => false,
      removeFromWatchlist: async () => false,
      isInWatchlist: () => false,
      toggleWatchlist: async () => false,
      loadWatchlist: async () => {}
    }
  }
  return ctx
}
