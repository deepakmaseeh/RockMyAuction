'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('buyer') // Default to buyer
  const [user, setUser] = useState(null) // ✅ FIXED: Start with null instead of hardcoded data
  const [isAuthenticated, setIsAuthenticated] = useState(false) // ✅ ADDED: Track auth state

  // ✅ FIXED: Check for stored user data on mount
  useEffect(() => {
    const checkAuthState = () => {
      try {
        // Check for stored auth token
        const token = localStorage.getItem('auth-token')
        const storedUser = localStorage.getItem('user-data')
        const savedRole = localStorage.getItem('preferredRole')

        if (token && storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
          console.log('🔄 Restored user from localStorage:', userData)
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

  // ✅ ADDED: Update user function (called from login/signup)
  const updateUser = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    
    // Store in localStorage
    localStorage.setItem('user-data', JSON.stringify(userData))
    console.log('👤 User updated in context:', userData)
  }

  // ✅ ADDED: Logout function
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setCurrentRole('buyer')
    
    // Clear localStorage
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    localStorage.removeItem('preferredRole')
    
    console.log('🚪 User logged out')
  }

  // ✅ ADDED: Login function (for compatibility)
  const login = (userData) => {
    updateUser(userData)
  }

  const value = {
    // User state
    user,
    setUser: updateUser, // ✅ FIXED: Use updateUser function
    isAuthenticated,
    login, // ✅ ADDED: For backward compatibility
    logout, // ✅ ADDED: Logout function
    
    // Role state  
    currentRole,
    switchRole,
    isBuyer: currentRole === 'buyer',
    isSeller: currentRole === 'seller',
    
    // ✅ ADDED: Computed values
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

// ✅ ADDED: Custom hook for auth state
export function useAuth() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useAuth must be used within a RoleProvider')
  }
  
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
    userName: context.userName,
    userEmail: context.userEmail,
    userId: context.userId,
  }
}
