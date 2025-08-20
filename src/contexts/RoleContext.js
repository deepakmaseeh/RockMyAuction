'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('buyer')
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true) // ✅ ADDED: Loading state

  // ✅ FIXED: Check for stored auth data on mount and keep user logged in
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const token = localStorage.getItem('auth-token')
        const storedUser = localStorage.getItem('user-data')
        const savedRole = localStorage.getItem('preferredRole')

        console.log('🔍 Checking auth state:', {
          hasToken: !!token,
          hasUserData: !!storedUser,
          savedRole
        })

        if (token && storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
          console.log('🔄 User restored from localStorage:', userData)
        } else {
          setUser(null)
          setIsAuthenticated(false)
          console.log('❌ No valid auth data found')
        }

        if (savedRole && (savedRole === 'buyer' || savedRole === 'seller')) {
          setCurrentRole(savedRole)
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        // Clear corrupted data
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user-data')
        localStorage.removeItem('preferredRole')
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false) // ✅ FIXED: Set loading to false after check
      }
    }

    checkAuthState()
  }, [])

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
    updateUser(userData)
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
