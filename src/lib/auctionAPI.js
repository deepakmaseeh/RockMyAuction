// Use Next.js API routes (which proxy to backend)
// In browser, use relative URLs to hit Next.js API routes
// Next.js API routes will proxy to backend Express server
const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

class AuctionAPI {
  constructor() {
    // Use empty string for browser (relative URLs), backend URL for server-side
    this.baseURL = API_BASE_URL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    // Use Next.js API routes for browser requests (they proxy to backend)
    const url = typeof window !== 'undefined' 
      ? endpoint // Use relative URL in browser (hits Next.js API route)
      : `${this.baseURL}${endpoint}`; // Use full URL for server-side

    console.log('🚀 API Request:', {
      method: options.method || 'GET',
      url,
      body: options.body,
    });

    // Check if body is FormData - if so, don't set Content-Type (let browser set it with boundary)
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        // Only set Content-Type if it's not FormData and not explicitly undefined
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Accept: 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // If Content-Type is explicitly undefined in options.headers, remove it
    if (options.headers && options.headers['Content-Type'] === undefined) {
      delete config.headers['Content-Type'];
    }

    // Attach token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ API Success:', data);
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('❌ API Error:', {
        url,
        method: config.method || 'GET',
        error: error.message,
      });
      throw this.createApiError(error);
    }
  }

  getAuthToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  }

  createApiError(error) {
    const apiError = new Error(error.message);
    apiError.isNetworkError = true;
    return apiError;
  }

  handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
  }

  async handleErrorResponse(response) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text().catch(() => 'Unknown error');
    }

    console.error('🔥 API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    });

    switch (response.status) {
      case 400:
        throw new Error(errorData.message || errorData.error || 'Bad request. Please check your input.');
      case 401:
        this.handleUnauthorized();
        throw new Error(errorData.message || 'Authentication required. Please login again.');
      case 403:
        throw new Error(errorData.message || 'Access forbidden. You do not have permission.');
      case 404:
        throw new Error(errorData.message || 'API endpoint not found.');
      case 422:
        throw new Error(errorData.message || `Validation error: ${JSON.stringify(errorData)}`);
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error('Server error. Please try again later.');
      case 502:
        throw new Error('Service temporarily unavailable. Please try again.');
      case 503:
        throw new Error('Service unavailable. The server might be starting up.');
      default:
        const message = errorData.message || errorData.error || `Request failed: ${response.status} ${response.statusText}`;
        throw new Error(message);
    }
  }


  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user-data');
      localStorage.removeItem('accessToken');
      console.log('🧹 Auth data cleared from localStorage');
    }
    return { success: true };
  }

  // Auth endpoints
  async login(credentials) {
    // Backend expects { type: 'login', email, password }
    const response = await this.request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        type: 'login',
        email: credentials.email,
        password: credentials.password,
      }),
    });
    
    // Store token if received
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('auth-token', response.token);
    }
    
    return response;
  }

  async register(userData) {
    // Backend expects { type: 'register', name, email, password, role }
    const response = await this.request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        type: 'register',
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer',
      }),
    });
    
    // Store token if received
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('auth-token', response.token);
    }
    
    return response;
  }

  // Profile endpoints
  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async updateUserProfile(userData) {
    return this.request('/api/auth/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getSeller(sellerId) {
    return this.request(`/api/users/${sellerId}`, {
      method: 'GET',
    });
  }

  // Auction endpoints
  async createAuction(auctionData) {
    return this.request('/api/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  }

  async getAuctions(query = '') {
    return this.request(`/api/auctions${query}`);
  }

  async getAuctionById(id) {
    return this.request(`/api/auctions/${id}`);
  }

  async updateAuction(id, auctionData) {
    return this.request(`/api/auctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(auctionData),
    });
  }

  async deleteAuction(id) {
    return this.request(`/api/auctions/${id}`, {
      method: 'DELETE',
    });
  }

  // Bid endpoints
  async placeBid(auctionId, bidAmount) {
    return this.request(`/api/auctions/${auctionId}/bids`, {
      method: 'POST',
      body: JSON.stringify({ amount: bidAmount }),
    });
  }

  async getBidsForAuction(auctionId) {
    return this.request(`/api/auctions/${auctionId}/bids`);
  }

  // Wishlist endpoints
  async addToWishlist(auctionId) {
    return this.request(`/api/wishlist/${auctionId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(auctionId) {
    return this.request(`/api/wishlist/${auctionId}`, {
      method: 'DELETE',
    });
  }

  async getWishlist() {
    return this.request('/api/wishlist');
  }

  // Review endpoints
  async createReview(auctionId, reviewData) {
    return this.request(`/api/auctions/${auctionId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviewsForAuction(auctionId) {
    return this.request(`/api/auctions/${auctionId}/reviews`);
  }

  async deleteReview(auctionId, reviewId) {
    return this.request(`/api/auctions/${auctionId}/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAdminAuctions() {
    return this.request('/api/admin/auctions');
  }

  async getSellerAuctions(sellerId) {
    return this.request(`/api/users/${sellerId}/auctions`);
  }

  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Use Next.js API route for upload (which proxies to backend)
    // In browser, use relative URL to hit Next.js API route
    const url = typeof window !== 'undefined' 
      ? '/api/upload' // Use relative URL in browser (hits Next.js API route)
      : `${this.baseURL}/api/upload`; // Use full URL for server-side
    const token = this.getAuthToken();
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let browser set it automatically with boundary
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || errorData.error || 'Upload failed');
    }
    
    return await response.json();
  }
}

export const auctionAPI = new AuctionAPI();
export default auctionAPI;
