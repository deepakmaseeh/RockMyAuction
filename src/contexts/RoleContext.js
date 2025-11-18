'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('buyer')
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true) // ✅ ADDED: Loading state

  // Function to check and update auth state
  const checkAuthState = () => {
    try {
      const token = localStorage.getItem('auth-token')
      const storedUser = localStorage.getItem('user-data')
      const savedRole = localStorage.getItem('preferredRole')

      console.log('🔍 Checking auth state:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        hasUserData: !!storedUser,
        userDataLength: storedUser ? storedUser.length : 0,
        savedRole,
        rawUserData: storedUser
      })

      // Only restore user if we have BOTH a valid token AND user data
      // Token should not be 'demo-token' or empty
      if (token && storedUser && token !== 'demo-token' && token.trim() !== '') {
        try {
          const userData = JSON.parse(storedUser)
          console.log('📦 Parsed userData:', userData)
          console.log('🔍 Validating userData:', {
            hasId: !!userData.id,
            hasEmail: !!userData.email,
            id: userData.id,
            email: userData.email,
            name: userData.name,
            isDemoEmail: userData.email === 'demo@example.com'
          })
          
          // Verify user data has valid fields (accept either id or _id)
          const userId = userData.id || userData._id
          if (userData && userId && userData.email && userData.email !== 'demo@example.com') {
            // Ensure id field exists (use _id if id doesn't exist)
            if (!userData.id && userData._id) {
              userData.id = userData._id
            }
            
            setUser(userData)
            setIsAuthenticated(true)
            console.log('✅ User restored from localStorage:', {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role
            })
          } else {
            // Invalid user data - clear it
            console.log('⚠️ Invalid user data - clearing storage', {
              hasUserData: !!userData,
              hasUserId: !!userId,
              hasEmail: !!userData?.email,
              isDemoEmail: userData?.email === 'demo@example.com'
            })
            localStorage.removeItem('auth-token')
            localStorage.removeItem('user-data')
            localStorage.removeItem('default-user-id')
            setUser(null)
            setIsAuthenticated(false)
          }
        } catch (parseError) {
          console.error('❌ Error parsing user data:', parseError)
          console.error('Raw userData string:', storedUser)
          localStorage.removeItem('user-data')
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        // No valid auth - clear any demo data
        console.log('⚠️ No valid authentication:', {
          hasToken: !!token,
          hasUserData: !!storedUser,
          tokenValue: token ? token.substring(0, 20) + '...' : 'none',
          isDemoToken: token === 'demo-token'
        })
        if (token === 'demo-token' || !token) {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-data')
          localStorage.removeItem('default-user-id')
        }
        setUser(null)
        setIsAuthenticated(false)
      }

      if (savedRole && (savedRole === 'buyer' || savedRole === 'seller')) {
        setCurrentRole(savedRole)
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error)
      // On error, clear everything and require login
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
      localStorage.removeItem('default-user-id')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  // Check for stored auth data on mount and keep user logged in
  // REQUIRE REAL AUTHENTICATION - NO DEMO USERS
  useEffect(() => {
    // IMMEDIATE check on mount (synchronous for initial render)
    console.log('🔄 RoleContext: Initial mount - checking auth state immediately')
    checkAuthState()
    
    // Listen for storage changes (e.g., when user logs in from another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'auth-token' || e.key === 'user-data') {
        console.log('🔄 RoleContext: Storage changed, re-checking auth state:', e.key)
        checkAuthState()
      }
    }
    
    // Listen for custom storage events (when localStorage is updated in same window)
    const handleCustomStorageChange = () => {
      console.log('🔄 RoleContext: Custom storage event, re-checking auth state')
      checkAuthState()
    }
    
    // Also check on window focus (when user comes back to the tab)
    const handleFocus = () => {
      console.log('🔄 RoleContext: Window focused, re-checking auth state')
      checkAuthState()
    }
    
    // CRITICAL: Also check on route change (navigation)
    const handleRouteChange = () => {
      console.log('🔄 RoleContext: Route changed, re-checking auth state')
      // Small delay to ensure localStorage is accessible
      setTimeout(() => {
        checkAuthState()
      }, 100)
    }
    
    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('localStorageChange', handleCustomStorageChange)
      window.addEventListener('focus', handleFocus)
      
      // Listen for popstate (browser back/forward)
      window.addEventListener('popstate', handleRouteChange)
      
      // Also check periodically in case state gets out of sync (every 2 seconds for first 10 seconds after mount)
      const intervalId = setInterval(() => {
        const token = localStorage.getItem('auth-token')
        const userData = localStorage.getItem('user-data')
        if (token && userData && (!user || !isAuthenticated)) {
          console.log('🔄 RoleContext: Periodic check - found auth data but state not set, re-checking')
          checkAuthState()
        }
      }, 2000)
      
      // Clear interval after 10 seconds
      setTimeout(() => {
        clearInterval(intervalId)
      }, 10000)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('localStorageChange', handleCustomStorageChange)
        window.removeEventListener('focus', handleFocus)
        window.removeEventListener('popstate', handleRouteChange)
        clearInterval(intervalId)
      }
    }
  }, []) // Only run on mount

  const switchRole = (newRole) => {
    if (newRole === 'buyer' || newRole === 'seller') {
      setCurrentRole(newRole)
      localStorage.setItem('preferredRole', newRole)
      console.log('🔄 Role switched to:', newRole)
    }
  }

  // ✅ FIXED: Update user function
  const updateUser = (userData) => {
    console.log('👤 Updating user in context:', userData)
    setUser(userData)
    setIsAuthenticated(true)
    
    // Store in localStorage
    localStorage.setItem('user-data', JSON.stringify(userData))
  }

  // ✅ FIXED: Logout function
  const logout = () => {
    console.log('🚪 Logging out user')
    setUser(null)
    setIsAuthenticated(false)
    setCurrentRole('buyer')
    
    // Clear localStorage
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    localStorage.removeItem('preferredRole')
    
    // Redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  // ✅ ADDED: Login function (for compatibility)
  const login = (userData) => {
    console.log('🔐 Login function called with userData:', userData)
    
    // Ensure token is in localStorage (should be set by auctionAPI.login or LoginForm)
    const token = localStorage.getItem('auth-token')
    if (!token || token.trim() === '') {
      console.error('❌ CRITICAL: No auth token found in localStorage after login!')
      console.error('   This will cause authentication failures!')
      console.error('   Available localStorage keys:', Object.keys(localStorage))
    } else {
      console.log('✅ Auth token verified in login function:', {
        length: token.length,
        prefix: token.substring(0, 20) + '...'
      })
    }
    
    // Store in localStorage first (ensure userData is stored)
    localStorage.setItem('user-data', JSON.stringify(userData))
    
    // Update user state immediately - this will trigger re-render of all consumers
    setUser(userData)
    setIsAuthenticated(true)
    
    // Dispatch custom event to notify other components (including Navbar)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('localStorageChange'))
      // Also dispatch storage event (for cross-tab communication)
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user-data',
        newValue: JSON.stringify(userData),
        oldValue: null,
        storageArea: localStorage
      }))
    }
    
    console.log('✅ User logged in successfully and context updated:', {
      userId: userData.id,
      userName: userData.name,
      userEmail: userData.email,
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    })
  }

  const value = {
    // User state
    user,
    setUser: updateUser,
    isAuthenticated,
    loading, // ✅ ADDED: Expose loading state
    login,
    logout,
    
    // Role state  
    currentRole,
    switchRole,
    isBuyer: currentRole === 'buyer',
    isSeller: currentRole === 'seller',
    
    // Computed values
    userName: user?.name || 'Guest',
    userEmail: user?.email || '',
    userId: user?.id || null,
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useUserRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useUserRole must be used within a RoleProvider')
  }
  return context
}

// Custom hook for auth state
export function useAuth() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useAuth must be used within a RoleProvider')
  }
  
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    loading: context.loading,
    login: context.login,
    logout: context.logout,
    userName: context.userName,
    userEmail: context.userEmail,
    userId: context.userId,
  }
}
