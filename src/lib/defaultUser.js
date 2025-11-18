// Utility function to get authenticated user ID
// DEPRECATED: Use useUserRole() hook instead - requires actual authentication

export function getDefaultUserId() {
  if (typeof window === 'undefined') {
    // Server-side: return null - no default users
    return null
  }

  // Only return user ID if authenticated (not demo)
  const token = localStorage.getItem('auth-token')
  const userData = localStorage.getItem('user-data')
  
  if (token && token !== 'demo-token' && userData) {
    try {
      const user = JSON.parse(userData)
      if (user.name !== 'Demo User') {
        return user.id
      }
    } catch (e) {
      // Invalid user data
    }
  }
  
  return null // User must login
}

export function ensureDefaultUser() {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('auth-token')
  const userData = localStorage.getItem('user-data')
  
  // Only return user if authenticated (not demo)
  if (token && token !== 'demo-token' && userData) {
    try {
      const user = JSON.parse(userData)
      if (user.name !== 'Demo User') {
        return user
      }
    } catch (e) {
      // Invalid user data
    }
  }
  
  return null // User must login
}


