const PRODUCTION_API_URL = 'https://excellwebsolution.com';
const DEVELOPMENT_API_URL = 'http://localhost:5000';

// Use localhost in development, production URL otherwise
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? DEVELOPMENT_API_URL
  : PRODUCTION_API_URL;

class AuctionAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    console.log('🚀 API Request:', {
      method: options.method || 'GET',
      url,
      body: options.body,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      ...options,
    };

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
        // Clone response before reading it, in case we need to read it again
        const responseClone = response.clone();
        await this.handleErrorResponse(responseClone);
        // This will throw, so code below won't execute
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ API Success:', data);
        return data;
      }

      return await response.text();
    } catch (error) {
      const errorDetails = {
        url,
        method: config.method || 'GET',
        error: error.message || 'Unknown error',
        stack: error.stack || 'No stack trace',
        name: error.name || 'Error',
      };
      console.error('❌ API Error:', JSON.stringify(errorDetails, null, 2));
      throw this.createApiError(error);
    }
  }

  async handleErrorResponse(response) {
    let errorData;
    let errorMessage = 'Unknown error';
    
    try {
      const text = await response.text();
      try {
        errorData = JSON.parse(text);
        // Extract error message from various possible formats
        errorMessage = errorData.message || errorData.error || errorData.data?.error || errorData.data?.message || text || 'Unknown error';
      } catch {
        // Not JSON, use text as error message
        errorData = text;
        errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (e) {
      errorData = null;
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    const errorLog = {
      status: response.status,
      statusText: response.statusText,
      url: response.url || 'Unknown URL',
      data: errorData,
      message: errorMessage,
    };
    
    // Stringify to ensure proper serialization
    try {
      console.error('🔥 API Error Response:', JSON.stringify(errorLog, null, 2));
    } catch (e) {
      console.error('🔥 API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url || 'Unknown URL',
        message: errorMessage,
        dataType: typeof errorData,
      });
    }

    switch (response.status) {
      case 400:
        throw new Error(errorMessage || 'Bad request. Please check your input.');
      case 401:
        this.handleUnauthorized();
        throw new Error(errorMessage || 'Authentication required. Please login again.');
      case 403:
        throw new Error(errorMessage || 'Access forbidden. You do not have permission.');
      case 404:
        throw new Error(errorMessage || 'API endpoint not found.');
      case 422:
        throw new Error(errorMessage || `Validation error: ${JSON.stringify(errorData)}`);
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error(errorMessage || 'Server error. Please try again later.');
      case 502:
        throw new Error('Service temporarily unavailable. Please try again.');
      case 503:
        throw new Error('Service unavailable. The server might be starting up.');
      default:
        const message = errorData.message || errorData.error || `Request failed: ${response.status} ${response.statusText}`;
        throw new Error(message);
    }
  }

  handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user-data');
      localStorage.removeItem('accessToken');

      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')
      ) {
        window.location.href = '/login';
      }
    }
  }

  getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token') || localStorage.getItem('accessToken');
  }

  createApiError(error) {
    return {
      message: error.message || 'An unexpected error occurred',
      type: 'API_ERROR',
      timestamp: new Date().toISOString(),
      isNetworkError:
        error.message.includes('Failed to fetch') ||
        error.message.includes('ERR_FAILED') ||
        error.message.includes('CORS') ||
        error.message.includes('net::ERR_'),
    };
  }

  // ✅ FIXED: Registration method
  async register(userData) {
    try {
      console.log('📝 Registering user:', { email: userData.email, name: userData.name });
      
      const requestData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };

      console.log('📤 Sending registration request:', requestData);

      const response = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      if (response.token) {
        localStorage.setItem('auth-token', response.token);
        console.log('💾 Token stored in localStorage');
      }

      const userData_processed = {
        id: response._id,
        name: response.name,
        email: response.email,
      };
      localStorage.setItem('user-data', JSON.stringify(userData_processed));

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error.isNetworkError) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  // ✅ FIXED: Login method
  async login(credentials) {
    try {
      console.log('🔐 Logging in user:', { email: credentials.email });
      
      const requestData = {
        email: credentials.email,
        password: credentials.password,
      };

      console.log('📤 Sending login request:', requestData);

      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      if (response.token) {
        localStorage.setItem('auth-token', response.token);
        console.log('💾 Token stored in localStorage');
      }
      
      const userData = {
        id: response._id,
        name: response.name,
        email: response.email,
      };
      localStorage.setItem('user-data', JSON.stringify(userData));
      
      return {
        ...response,
        user: userData
      };
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.isNetworkError) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      throw error;
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

  // Profile endpoints
  async getCurrentUser() {
    return this.request('/api/auth/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getSeller(sellerId) {
    return this.request(`/api/users?id=${sellerId}`, {
      method: 'GET',
    });
  }

  async getUserById(userId) {
    return this.request(`/api/users?id=${userId}`, {
      method: 'GET',
    });
  }

  // ✅ NEW: WISHLIST METHODS
  async getWishlist(checkAuctionId = null) {
    const queryParam = checkAuctionId ? `?check=${checkAuctionId}` : '';
    return this.request(`/api/wishlist${queryParam}`, {
      method: 'GET',
    });
  }

  async addToWishlist(auctionId) {
    return this.request('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auctionId }),
    });
  }

  async removeFromWishlist(auctionId) {
    return this.request(`/api/wishlist/${auctionId}`, {
      method: 'DELETE',
    });
  }

  async isInWishlist(auctionId) {
    return this.request(`/api/wishlist?check=${auctionId}`, {
      method: 'GET',
    });
  }

  // Wallet endpoints
  async getWallet() {
    return this.request('/api/wallet', {
      method: 'GET',
    });
  }

  async getWalletTransactions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });
    return this.request(`/api/wallet/transactions${queryParams.toString() ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async addMoney(amount, paymentMethod) {
    return this.request('/api/wallet/add', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
    });
  }

  async withdrawMoney(amount, withdrawalMethod) {
    return this.request('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, withdrawalMethod }),
    });
  }

  async getPaymentMethods() {
    return this.request('/api/wallet/payment-methods', {
      method: 'GET',
    });
  }

  // Auction endpoints
  async getAuctions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });
    const response = await this.request(`/api/auctions${queryParams.toString() ? `?${queryParams}` : ''}`);
    console.log('getAuctions response:', response);
    return response;
  }

  async getAuction(id) {
    return this.request(`/api/auctions/${id}`);
  }

  async createAuction(auctionData) {
    return this.request('/api/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  }

  // ✅ NEW: Create auction with image file
  async createAuctionWithImage(formData) {
    const token = this.getAuthToken();
    
    const response = await fetch(`${this.baseURL}/api/auctions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      throw new Error(`Failed to create auction: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Auction created successfully:', result);
    return result;
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

  // Bidding endpoints
  async placeBid(bidData) {
    return this.request('/api/bids', {
      method: 'POST',
      body: JSON.stringify({
        auctionId: bidData.auctionId,
        bidAmount: bidData.bidAmount || bidData.amount,
      }),
    });
  }

  async getBids(auctionId) {
    return this.request(`/api/bids/${auctionId}`);
  }

  // Upload endpoints
  async getUploadUrl(fileName, fileType) {
    return this.request('/api/s3-upload', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileType }),
    });
  }

  // Upload file through backend (avoids CORS issues)
  async uploadFile(fileData) {
    const { file, fileName, fileType } = fileData;
    return this.request('/api/s3-upload/upload', {
      method: 'POST',
      body: JSON.stringify({ 
        file, // base64 encoded file
        fileName, 
        fileType 
      }),
    });
  }

  // Upload profile photo (saves to profiles/ folder in GCS)
  async uploadProfilePhoto(fileData) {
    const { file, fileName, fileType } = fileData;
    return this.request('/api/s3-upload/upload-profile', {
      method: 'POST',
      body: JSON.stringify({ 
        file, // base64 encoded file
        fileName, 
        fileType 
      }),
    });
  }

  // AI endpoints
  async analyzeImage(imageData) {
    const { imageKey, imageUrl, formFill, prompt } = imageData;
    return this.request('/api/analyze-image', {
      method: 'POST',
      body: JSON.stringify({ 
        imageKey, 
        imageUrl, 
        formFill: formFill || false,
        prompt 
      }),
    });
  }

  async generateAIContent(data) {
    // Supports both old format (string prompt) and new format (object with type, prompt, etc.)
    const body = typeof data === 'string' 
      ? { prompt: data }
      : data;
    
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async generateLotDraft(prompt, imageData = null) {
    const body = {
      type: 'lotDraft',
      prompt,
      ...(imageData && { imageData })
    };
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Catalogue endpoints
  async getCatalogues(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });
    return this.request(`/api/catalogues${queryParams.toString() ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getCatalogue(id) {
    return this.request(`/api/catalogues/${id}`, {
      method: 'GET',
    });
  }

  async createCatalogue(catalogueData) {
    return this.request('/api/catalogues', {
      method: 'POST',
      body: JSON.stringify(catalogueData),
    });
  }

  async updateCatalogue(id, catalogueData) {
    return this.request(`/api/catalogues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catalogueData),
    });
  }

  async deleteCatalogue(id) {
    return this.request(`/api/catalogues/${id}`, {
      method: 'DELETE',
    });
  }

  // Lot endpoints
  async getLots(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });
    return this.request(`/api/lots${queryParams.toString() ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getLot(lotId) {
    return this.request(`/api/lots/${lotId}`, {
      method: 'GET',
    });
  }

  async createLot(lotData) {
    return this.request('/api/lots', {
      method: 'POST',
      body: JSON.stringify(lotData),
    });
  }

  async updateLot(lotId, lotData) {
    return this.request(`/api/lots/${lotId}`, {
      method: 'PUT',
      body: JSON.stringify(lotData),
    });
  }

  async deleteLot(lotId) {
    return this.request(`/api/lots/${lotId}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAdminAuctions(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });
    return this.request(`/api/admin/auctions${queryParams.toString() ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getAdminAuction(id) {
    return this.request(`/api/admin/auctions/${id}`, {
      method: 'GET',
    });
  }

  async getAdminAuctionLots(auctionId, params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });
    return this.request(`/api/admin/auctions/${auctionId}/lots${queryParams.toString() ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async bulkLotActions(actions) {
    return this.request('/api/admin/lots/bulk', {
      method: 'POST',
      body: JSON.stringify({ actions }),
    });
  }

  async reorderLots(auctionId, lotOrders) {
    return this.request('/api/admin/lots/reorder', {
      method: 'PUT',
      body: JSON.stringify({ auctionId, lotOrders }),
    });
  }

  async importLots(auctionId, fileData, format = 'csv') {
    return this.request('/api/admin/lots/import', {
      method: 'POST',
      body: JSON.stringify({ auctionId, fileData, format }),
    });
  }

  // User management endpoints
  async getAllUsers() {
    return this.request('/api/users', {
      method: 'GET',
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async blockUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'block' }),
    });
  }

  async unblockUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'unblock' }),
    });
  }

  async deactivateUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'deactivate' }),
    });
  }

  async activateUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'activate' }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // User data endpoints
  async getUserBids(userId) {
    return this.request(`/api/user/bids?userId=${userId}`, {
      method: 'GET',
    });
  }

  async getSellerAnalytics(userId) {
    return this.request(`/api/seller/analytics?userId=${userId}`, {
      method: 'GET',
    });
  }
}

export const auctionAPI = new AuctionAPI();
export default auctionAPI;
