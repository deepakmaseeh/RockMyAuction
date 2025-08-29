// const PRODUCTION_API_URL = 'https://excellwebsolution.com';
// const API_BASE_URL = PRODUCTION_API_URL;

// class AuctionAPI {
//   constructor() {
//     this.baseURL = API_BASE_URL;
//     this.timeout = 30000;
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;

//     console.log('🚀 API Request:', {
//       method: options.method || 'GET',
//       url,
//       body: options.body,
//     });

//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         ...options.headers,
//       },
//       // ✅ FIXED: Removed credentials: 'include' to fix CORS
//       // credentials: 'include', // ← REMOVED THIS LINE
//       ...options,
//     };

//     // Attach token if available
//     const token = this.getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     try {
//       const response = await fetch(url, config);

//       console.log('📡 API Response:', {
//         status: response.status,
//         statusText: response.statusText,
//         url: response.url,
//       });

//       if (!response.ok) {
//         await this.handleErrorResponse(response);
//       }

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const data = await response.json();
//         console.log('✅ API Success:', data);
//         return data;
//       }

//       return await response.text();
//     } catch (error) {
//       console.error('❌ API Error:', {
//         url,
//         method: config.method || 'GET',
//         error: error.message,
//       });
//       throw this.createApiError(error);
//     }
//   }

//   async handleErrorResponse(response) {
//     let errorData;
//     try {
//       errorData = await response.json();
//     } catch {
//       errorData = await response.text().catch(() => 'Unknown error');
//     }

//     console.error('🔥 API Error Response:', {
//       status: response.status,
//       statusText: response.statusText,
//       data: errorData,
//     });

//     switch (response.status) {
//       case 400:
//         throw new Error(errorData.message || errorData.error || 'Bad request. Please check your input.');
//       case 401:
//         this.handleUnauthorized();
//         throw new Error(errorData.message || 'Authentication required. Please login again.');
//       case 403:
//         throw new Error(errorData.message || 'Access forbidden. You do not have permission.');
//       case 404:
//         throw new Error(errorData.message || 'API endpoint not found.');
//       case 422:
//         throw new Error(errorData.message || `Validation error: ${JSON.stringify(errorData)}`);
//       case 429:
//         throw new Error('Too many requests. Please wait a moment and try again.');
//       case 500:
//         throw new Error('Server error. Please try again later.');
//       case 502:
//         throw new Error('Service temporarily unavailable. Please try again.');
//       case 503:
//         throw new Error('Service unavailable. The server might be starting up.');
//       default:
//         const message = errorData.message || errorData.error || `Request failed: ${response.status} ${response.statusText}`;
//         throw new Error(message);
//     }
//   }

//   handleUnauthorized() {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('auth-token');
//       localStorage.removeItem('refresh-token');
//       localStorage.removeItem('user-data');
//       localStorage.removeItem('accessToken');

//       // Redirect to login
//       if (
//         !window.location.pathname.includes('/login') &&
//         !window.location.pathname.includes('/signup')
//       ) {
//         window.location.href = '/login';
//       }
//     }
//   }

//   getAuthToken() {
//     if (typeof window === 'undefined') return null;
//     return localStorage.getItem('auth-token') || localStorage.getItem('accessToken');
//   }

//   createApiError(error) {
//     return {
//       message: error.message || 'An unexpected error occurred',
//       type: 'API_ERROR',
//       timestamp: new Date().toISOString(),
//       isNetworkError:
//         error.message.includes('Failed to fetch') ||
//         error.message.includes('ERR_FAILED') ||
//         error.message.includes('CORS') ||
//         error.message.includes('net::ERR_'),
//     };
//   }

//   // ✅ FIXED: Registration method
//   async register(userData) {
//     try {
//       console.log('📝 Registering user:', { email: userData.email, name: userData.name });
      
//       const requestData = {
//         name: userData.name,
//         email: userData.email,
//         password: userData.password,
//       };

//       console.log('📤 Sending registration request:', requestData);

//       const response = await this.request('/api/auth/register', {
//         method: 'POST',
//         body: JSON.stringify(requestData),
//       });

//       // Store token in localStorage only (no cookies needed)
//       if (response.token) {
//         localStorage.setItem('auth-token', response.token);
//         console.log('💾 Token stored in localStorage');
//       }

//       const userData_processed = {
//         id: response._id,
//         name: response.name,
//         email: response.email,
//       };
//       localStorage.setItem('user-data', JSON.stringify(userData_processed));

//       return response;
//     } catch (error) {
//       console.error('Registration failed:', error);
      
//       if (error.isNetworkError) {
//         throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
//       }
      
//       throw error;
//     }
//   }

//   // ✅ FIXED: Login method
//   async login(credentials) {
//     try {
//       console.log('🔐 Logging in user:', { email: credentials.email });
      
//       const requestData = {
//         email: credentials.email,
//         password: credentials.password,
//       };

//       console.log('📤 Sending login request:', requestData);

//       const response = await this.request('/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify(requestData),
//       });

//       // Store token in localStorage only
//       if (response.token) {
//         localStorage.setItem('auth-token', response.token);
//         console.log('💾 Token stored in localStorage');
//       }
      
//       const userData = {
//         id: response._id,
//         name: response.name,
//         email: response.email,
//       };
//       localStorage.setItem('user-data', JSON.stringify(userData));
      
//       return {
//         ...response,
//         user: userData
//       };
//     } catch (error) {
//       console.error('Login failed:', error);
      
//       if (error.isNetworkError) {
//         throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
//       }
      
//       throw error;
//     }
//   }

//   async logout() {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('auth-token');
//       localStorage.removeItem('refresh-token');
//       localStorage.removeItem('user-data');
//       localStorage.removeItem('accessToken');
//       console.log('🧹 Auth data cleared from localStorage');
//     }
//     return { success: true };
//   }

//   // Profile endpoints
//   async getCurrentUser() {
//     return this.request('/api/auth/profile');
//   }

//   async updateUserProfile(userData) {
//     return this.request('/api/auth/profile', {
//       method: 'PUT',
//       body: JSON.stringify(userData),
//     });
//   }

//   // Add this method to your existing auctionAPI class
// async getSeller(sellerId) {
//   return this.request(`/api/users/${sellerId}`, {
//     method: 'GET',
//   });
// }

//   // Add these methods to your existing auctionAPI class

// // Wallet endpoints
// async getWallet() {
//   return this.request('/api/wallet', {
//     method: 'GET',
//   });
// }

// async getWalletTransactions(params = {}) {
//   const queryParams = new URLSearchParams();
//   Object.entries(params).forEach(([key, value]) => {
//     if (value) queryParams.set(key, value);
//   });
//   return this.request(`/api/wallet/transactions${queryParams.toString() ? `?${queryParams}` : ''}`, {
//     method: 'GET',
//   });
// }

// async addMoney(amount, paymentMethod) {
//   return this.request('/api/wallet/add', {
//     method: 'POST',
//     body: JSON.stringify({ amount, paymentMethod }),
//   });
// }

// async withdrawMoney(amount, withdrawalMethod) {
//   return this.request('/api/wallet/withdraw', {
//     method: 'POST',
//     body: JSON.stringify({ amount, withdrawalMethod }),
//   });
// }

// async getPaymentMethods() {
//   return this.request('/api/wallet/payment-methods', {
//     method: 'GET',
//   });
// }

//   // Auction endpoints
//   async getAuctions(params = {}) {
//     const queryParams = new URLSearchParams();
//     Object.entries(params).forEach(([key, value]) => {
//       if (value) queryParams.set(key, value);
//     });
//     //  return this.request(`/api/auctions${queryParams.toString() ? `?${queryParams}` : ''}`);
//     const response = await this.request(`/api/auctions${queryParams.toString() ? `?${queryParams}` : ''}`);
//     console.log('getAuctions response:', response);
//     return response;
//   }

//   async getAuction(id) {
//     return this.request(`/api/auctions/${id}`);
//   }

//   async createAuction(auctionData) {
//     return this.request('/api/auctions', {
//       method: 'POST',
//       body: JSON.stringify(auctionData),
//     });
//   }


//   async updateAuction(id, auctionData) {
//     return this.request(`/api/auctions/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(auctionData),
//     });
//   }

//   async deleteAuction(id) {
//     return this.request(`/api/auctions/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Bidding endpoints
//   async placeBid(bidData) {
//     return this.request('/api/bids', {
//       method: 'POST',
//       body: JSON.stringify({
//         auctionId: bidData.auctionId,
//         bidAmount: bidData.bidAmount || bidData.amount,
//       }),
//     });
//   }

//   async getBids(auctionId) {
//     return this.request(`/api/bids/${auctionId}`);
//   }

//   // AI endpoints
//   async generateAIContent(prompt) {
//     return this.request('/api/ai/generate', {
//       method: 'POST',
//       body: JSON.stringify({ prompt }),
//     });
//   }

//   // Add inside AuctionAPI class in your existing file

// // Fetch all users (for admin)
// async getAllUsers() {
//   return this.request('/api/users', {
//     method: 'GET',
//   });
// }

// // Block a user
// async blockUser(userId) {
//   return this.request(`/api/users/${userId}/block`, {
//     method: 'PUT',
//   });
// }

// // Deactivate a user
// async deactivateUser(userId) {
//   return this.request(`/api/users/${userId}/deactivate`, {
//     method: 'PUT',
//   });
// }

// // Delete a user
// async deleteUser(userId) {
//   return this.request(`/api/users/${userId}`, {
//     method: 'DELETE',
//   });
// }

// }

// export const auctionAPI = new AuctionAPI();
// export default auctionAPI;



const PRODUCTION_API_URL = 'https://excellwebsolution.com';
const API_BASE_URL = PRODUCTION_API_URL;

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
      // ✅ FIXED: Removed credentials: 'include' to fix CORS
      // credentials: 'include', // ← REMOVED THIS LINE
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

  handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user-data');
      localStorage.removeItem('accessToken');

      // Redirect to login
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

      // Store token in localStorage only (no cookies needed)
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

      // Store token in localStorage only
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

  // Add this method to your existing auctionAPI class
  async getSeller(sellerId) {
    return this.request(`/api/users/${sellerId}`, {
      method: 'GET',
    });
  }

  // ✅ NEW: WISHLIST METHODS
  // Get user's wishlist
  async getWishlist() {
    return this.request('/api/wishlist', {
      method: 'GET',
    });
  }

  // Add item to wishlist
  async addToWishlist(auctionId) {
    return this.request('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auctionId }),
    });
  }

  // Remove item from wishlist
  async removeFromWishlist(auctionId) {
    return this.request(`/api/wishlist/${auctionId}`, {
      method: 'DELETE',
    });
  }

  // Check if item is in wishlist
  async isInWishlist(auctionId) {
    return this.request(`/api/wishlist/check/${auctionId}`, {
      method: 'GET',
    });
  }

  // Wallet endpoints (your existing methods)
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

  // AI endpoints
  async generateAIContent(prompt) {
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // User management endpoints (your existing methods)
  async getAllUsers() {
    return this.request('/api/users', {
      method: 'GET',
    });
  }

  async blockUser(userId) {
    return this.request(`/api/users/${userId}/block`, {
      method: 'PUT',
    });
  }

  async deactivateUser(userId) {
    return this.request(`/api/users/${userId}/deactivate`, {
      method: 'PUT',
    });
  }

  async deleteUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

export const auctionAPI = new AuctionAPI();
export default auctionAPI;
