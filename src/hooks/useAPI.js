import { useState, useEffect } from 'react'
import { auctionAPI } from '@/lib/api'

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
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBids() {
      try {
        const response = await fetch(`/api/user/bids?userId=${userId}`)
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Failed to fetch bids:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchBids()
  }, [userId])

  return { data, loading }
}

export function useWatchlist(userId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const response = await fetch(`/api/user/watchlist?userId=${userId}`)
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Failed to fetch watchlist:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchWatchlist()
  }, [userId])

  return { data, loading }
}

export function useSellerAnalytics(userId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/seller/analytics?userId=${userId}`)
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchAnalytics()
  }, [userId])

  return { data, loading }
}

export function useEarnings(userId) {
  return useAPI(() => auctionAPI.getEarnings(userId), [userId])
}
