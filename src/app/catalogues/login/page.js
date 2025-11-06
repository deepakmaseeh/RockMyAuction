'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/contexts/RoleContext'

// Helper function to get or create default user ID
function getDefaultUserId() {
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

export default function StaticLogin() {
  const router = useRouter()
  const { login, isAuthenticated } = useUserRole()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Auto-login if not authenticated
    if (!isAuthenticated) {
      const defaultUserId = getDefaultUserId()
      const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
      
      login({
        id: defaultUserId,
        name: userData.name || 'Demo User',
        email: userData.email || 'demo@example.com'
      })
    }
  }, [isAuthenticated, login])

  const handleLogin = () => {
    setLoading(true)
    const defaultUserId = getDefaultUserId()
    const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
    
    login({
      id: defaultUserId,
      name: userData.name || 'Demo User',
      email: userData.email || 'demo@example.com'
    })
    
    setTimeout(() => {
      setLoading(false)
      router.push('/catalogues')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1f1f23] rounded-xl border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Demo Login</h1>
          <p className="text-gray-400">Static login for testing catalogues</p>
        </div>

        <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6">
          <p className="text-orange-300 text-sm">
            <strong>Note:</strong> This is a demo login. No backend authentication required.
            You'll be logged in as a demo user to test the catalogue UI.
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || isAuthenticated}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : isAuthenticated ? 'Already Logged In' : 'Login as Demo User'}
        </button>

        {isAuthenticated && (
          <div className="mt-4 text-center">
            <p className="text-green-400 text-sm mb-2">✓ You're logged in!</p>
            <button
              onClick={() => router.push('/catalogues')}
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Go to Catalogues →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

