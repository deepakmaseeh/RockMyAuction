import { useState, useEffect } from 'react'
import { auctionAPI } from '@/lib/auctionAPI'

// Generic hook for API calls
export function useAPI(apiCall, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Specific hooks for common operations
export function useAuctions(params = {}) {
  return useAPI(() => auctionAPI.getAuctions(params), [JSON.stringify(params)])
}

export function useAuction(id) {
  return useAPI(() => auctionAPI.getAuction(id), [id])
}

export function useUserBids(userId) {
  return useAPI(() => auctionAPI.getUserBids(userId), [userId])
}

export function useWatchlist(userId) {
  // Watchlist is the same as wishlist
  return useAPI(() => auctionAPI.getWishlist(), [userId])
}

export function useSellerAnalytics(userId) {
  return useAPI(() => auctionAPI.getSellerAnalytics(userId), [userId])
}

// Additional hooks for other resources
export function useCatalogues(params = {}) {
  return useAPI(() => auctionAPI.getCatalogues(params), [JSON.stringify(params)])
}

export function useCatalogue(id) {
  return useAPI(() => auctionAPI.getCatalogue(id), [id])
}

export function useLots(params = {}) {
  return useAPI(() => auctionAPI.getLots(params), [JSON.stringify(params)])
}

export function useLot(lotId) {
  return useAPI(() => auctionAPI.getLot(lotId), [lotId])
}

export function useWishlist(checkAuctionId = null) {
  return useAPI(() => auctionAPI.getWishlist(checkAuctionId), [checkAuctionId])
}

export function useBids(auctionId) {
  return useAPI(() => auctionAPI.getBids(auctionId), [auctionId])
}
