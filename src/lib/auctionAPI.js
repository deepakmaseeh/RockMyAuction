// FIXED /lib/auctionAPI.js
// Updated AuctionAPI with CORRECT endpoint matching your Postman
const PRODUCTION_API_URL = 'http://auction-env.eba-p4pfmhnm.ap-south-1.elasticbeanstalk.com'

// Use environment variable or default to your CORRECT production API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL

class AuctionAPI {
  constructor() {
    this.baseURL = API_BASE_URL
    this.timeout = 30000 // 30 seconds for AWS Elastic Beanstalk
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    console.log('🚀 API Request:', {
      method: options.method || 'GET',
      url,
      body: options.body
    })

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 30 seconds')), this.timeout)
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers for better compatibility
        'Accept': 'application/json',
        ...options.headers,
      },
      // Add credentials for CORS
      credentials: 'omit', // Don't send cookies to avoid CORS issues
      ...options,
    }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await Promise.race([
        fetch(url, config),
        timeoutPromise
      ])
      
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        await this.handleErrorResponse(response)
      }
      
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log('✅ API Success:', data)
        return data
      }
      
      return response.text()
    } catch (error) {
      console.error('❌ API Error:', {
        url,
        method: config.method || 'GET',
        error: error.message,
        stack: error.stack
      })
      throw this.createApiError(error)
    }
  }

  async handleErrorResponse(response) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text().catch(() => 'Unknown error')
    }
    
    console.error('🔥 API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: errorData
    })

    switch (response.status) {
      case 400:
        throw new Error(errorData.message || errorData.error || 'Bad request. Please check your input.')
      case 401:
        this.handleUnauthorized()
        throw new Error(errorData.message || 'Authentication required. Please login again.')
      case 403:
        throw new Error(errorData.message || 'Access forbidden. You do not have permission.')
      case 404:
        throw new Error('Resource not found.')
      case 422:
        throw new Error(errorData.message || `Validation error: ${JSON.stringify(errorData)}`)
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.')
      case 500:
        throw new Error('Server error. Please try again later.')
      case 502:
        throw new Error('Service temporarily unavailable. Please try again.')
      case 503:
        throw new Error('Service unavailable. The server might be starting up.')
      default:
        const message = errorData.message || errorData.error || `Request failed: ${response.status} ${response.statusText}`
        throw new Error(message)
    }
  }

  handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('refresh-token')
      localStorage.removeItem('user-data')
      localStorage.removeItem('accessToken')
      
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login'
      }
    }
  }

  getAuthToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth-token') || localStorage.getItem('accessToken')
  }

  createApiError(error) {
    return {
      message: error.message || 'An unexpected error occurred',
      type: 'API_ERROR',
      timestamp: new Date().toISOString(),
      isNetworkError: error.message.includes('Failed to fetch') || error.message.includes('ERR_FAILED') || error.message.includes('CORS')
    }
  }

  // =====================
  // AUTHENTICATION ENDPOINTS - FIXED to match your Postman exactly
  // =====================
  
  async register(userData) {
    try {
      console.log('📝 Registering user with your API schema:', userData)
      
      // Transform data to match your API schema EXACTLY like Postman
      const requestData = {
        type: "register",
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer'
      }

      console.log('📤 Sending registration request:', requestData)
      
      // FIXED: Use /api/auth (not /api/auth/register) to match Postman
      const response = await this.request('/api/auth', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
      
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      
      if (error.isNetworkError) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.')
      }
      
      throw error
    }
  }

  async login(credentials) {
    try {
      console.log('🔐 Logging in user with your API schema:', { email: credentials.email })
      
      // Transform data to match your API schema EXACTLY like Postman
      const requestData = {
        type: "login",
        email: credentials.email,
        password: credentials.password
      }

      console.log('📤 Sending login request:', requestData)
      
      // FIXED: Use /api/auth (not /api/auth/login) to match Postman
      const response = await this.request('/api/auth', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
      
      // Store auth token if provided
      if (response.token || response.accessToken || response.authToken) {
        const token = response.token || response.accessToken || response.authToken
        localStorage.setItem('auth-token', token)
        
        if (response.refreshToken) {
          localStorage.setItem('refresh-token', response.refreshToken)
        }
        if (response.user) {
          localStorage.setItem('user-data', JSON.stringify(response.user))
        }
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      
      if (error.isNetworkError) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.')
      }
      
      throw error
    }
  }

  async logout() {
    try {
      const requestData = {
        type: "logout"
      }
      
      await this.request('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
    } catch (error) {
      console.warn('Logout request failed, but clearing local data:', error)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('refresh-token')
        localStorage.removeItem('user-data')
        localStorage.removeItem('accessToken')
      }
    }
    
    return { success: true }
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  // =====================
  // AUCTION ENDPOINTS
  // =====================
  
  async getAuctions(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.set(key, value)
    })
    
    return this.request(`/api/auctions${queryParams.toString() ? `?${queryParams}` : ''}`)
  }

  async getAuction(id) {
    return this.request(`/api/auctions/${id}`)
  }

  async createAuction(auctionData) {
    const requestData = {
      type: "create",
      ...auctionData
    }
    
    return this.request('/api/auctions', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  async updateAuction(id, auctionData) {
    const requestData = {
      type: "update",
      ...auctionData
    }
    
    return this.request(`/api/auctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    })
  }

  async deleteAuction(id) {
    const requestData = {
      type: "delete"
    }
    
    return this.request(`/api/auctions/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(requestData),
    })
  }

  // =====================
  // BIDDING ENDPOINTS
  // =====================
  
  async placeBid(auctionId, bidData) {
    const requestData = {
      type: "place_bid",
      auctionId: auctionId,
      ...bidData
    }
    
    return this.request(`/api/auctions/${auctionId}/bids`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  async getBids(auctionId) {
    return this.request(`/api/auctions/${auctionId}/bids`)
  }

  async getUserBids(userId) {
    return this.request(`/api/users/${userId}/bids`)
  }

  // =====================
  // USER ENDPOINTS
  // =====================
  
  async getUserProfile(userId) {
    return this.request(`/api/users/${userId}`)
  }

  async updateUserProfile(userId, userData) {
    const requestData = {
      type: "update_profile",
      ...userData
    }
    
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    })
  }

  // =====================
  // WATCHLIST ENDPOINTS
  // =====================
  
  async getWatchlist(userId) {
    return this.request(`/api/users/${userId}/watchlist`)
  }

  async addToWatchlist(userId, auctionId) {
    const requestData = {
      type: "add_to_watchlist",
      auctionId: auctionId
    }
    
    return this.request(`/api/users/${userId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  async removeFromWatchlist(userId, auctionId) {
    const requestData = {
      type: "remove_from_watchlist"
    }
    
    return this.request(`/api/users/${userId}/watchlist/${auctionId}`, {
      method: 'DELETE',
      body: JSON.stringify(requestData),
    })
  }

  // =====================
  // OTHER ENDPOINTS
  // =====================
  
  async getMessages(userId) {
    return this.request(`/api/users/${userId}/messages`)
  }

  async sendMessage(messageData) {
    const requestData = {
      type: "send_message",
      ...messageData
    }
    
    return this.request('/api/messages', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  async getSellerAnalytics(userId) {
    return this.request(`/api/sellers/${userId}/analytics`)
  }

  async getEarnings(userId) {
    return this.request(`/api/sellers/${userId}/earnings`)
  }
}

export const auctionAPI = new AuctionAPI()
export default auctionAPI