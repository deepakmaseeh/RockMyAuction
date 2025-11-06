// Utility function to get or create default user ID
// This is for demo/testing purposes without backend authentication

export function getDefaultUserId() {
  if (typeof window === 'undefined') {
    // Server-side: return a default ID
    return 'default-user-server'
  }

  let defaultUserId = localStorage.getItem('default-user-id')
  if (!defaultUserId) {
    // Create a default user ID if none exists
    defaultUserId = 'default-user-' + Date.now()
    localStorage.setItem('default-user-id', defaultUserId)
    localStorage.setItem('user-data', JSON.stringify({
      id: defaultUserId,
      name: 'Demo User',
      email: 'demo@example.com'
    }))
    localStorage.setItem('auth-token', 'demo-token')
  }
  return defaultUserId
}

export function ensureDefaultUser() {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('user-data')
  if (!userData) {
    const defaultUserId = getDefaultUserId()
    return {
      id: defaultUserId,
      name: 'Demo User',
      email: 'demo@example.com'
    }
  }
  
  try {
    return JSON.parse(userData)
  } catch {
    const defaultUserId = getDefaultUserId()
    return {
      id: defaultUserId,
      name: 'Demo User',
      email: 'demo@example.com'
    }
  }
}


