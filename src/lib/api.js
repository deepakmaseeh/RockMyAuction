const API_BASE_URL = 'https://auction-api-n4y1.onrender.com'

// API utility functions
class AuctionAPI {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    })
  }

  // Auction endpoints
  async getAuctions(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/auctions${queryString ? `?${queryString}` : ''}`)
  }

  async getAuction(id) {
    return this.request(`/api/auctions/${id}`)
  }

  async createAuction(auctionData) {
    return this.request('/api/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    })
  }

  async updateAuction(id, auctionData) {
    return this.request(`/api/auctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(auctionData),
    })
  }

  async deleteAuction(id) {
    return this.request(`/api/auctions/${id}`, {
      method: 'DELETE',
    })
  }

  // Bidding endpoints
  async placeBid(auctionId, bidData) {
    return this.request(`/api/auctions/${auctionId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    })
  }

  async getBids(auctionId) {
    return this.request(`/api/auctions/${auctionId}/bids`)
  }

  async getUserBids(userId) {
    return this.request(`/api/users/${userId}/bids`)
  }

  // User endpoints
  async getUserProfile(userId) {
    return this.request(`/api/users/${userId}`)
  }

  async updateUserProfile(userId, userData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Watchlist endpoints
  async getWatchlist(userId) {
    return this.request(`/api/users/${userId}/watchlist`)
  }

  async addToWatchlist(userId, auctionId) {
    return this.request(`/api/users/${userId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify({ auctionId }),
    })
  }

  async removeFromWatchlist(userId, auctionId) {
    return this.request(`/api/users/${userId}/watchlist/${auctionId}`, {
      method: 'DELETE',
    })
  }

  // Messages endpoints
  async getMessages(userId) {
    return this.request(`/api/users/${userId}/messages`)
  }

  async sendMessage(messageData) {
    return this.request('/api/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Analytics endpoints
  async getSellerAnalytics(userId) {
    return this.request(`/api/sellers/${userId}/analytics`)
  }

  async getEarnings(userId) {
    return this.request(`/api/sellers/${userId}/earnings`)
  }
}

export const auctionAPI = new AuctionAPI()
export default auctionAPI
