'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import auctionAPI from '@/lib/auctionAPI'

export default function CataloguesLogin() {
  const router = useRouter()
  const { login, isAuthenticated } = useUserRole()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/catalogues')
    }
  }, [isAuthenticated, router])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Starting login...')
      
      const response = await auctionAPI.login({
        email: formData.email.trim(),
        password: formData.password
      })
      
      console.log('✅ Login successful:', response)

      // Update context with user data
      console.log('📦 Full login response:', JSON.stringify(response, null, 2))
      
      if (login && response && response.user) {
        // Backend returns _id, convert it to id for frontend
        const userId = response.user._id || response.user.id
        const userData = {
          id: userId,
          _id: userId, // Also store _id for compatibility
          name: response.user.name || 'User',
          email: response.user.email || formData.email.trim(),
          role: response.user.role || 'buyer'
        }
        
        console.log('👤 Prepared userData:', userData)
        
        // Verify token is stored
        const token = localStorage.getItem('auth-token')
        console.log('🔑 Token stored in localStorage:', !!token, token ? token.substring(0, 20) + '...' : 'none')
        
        // Store user data in localStorage (token is already stored by auctionAPI.login)
        const userDataString = JSON.stringify(userData)
        localStorage.setItem('user-data', userDataString)
        console.log('💾 Stored user-data in localStorage:', userDataString)
        
        // Verify it was stored correctly
        const storedData = localStorage.getItem('user-data')
        console.log('✅ Verified stored user-data:', storedData)
        
        // Update context - this should trigger re-render of Navbar
        console.log('🔄 Updating context with user data:', userData)
        login(userData)
        
        // Wait a bit to ensure context state updates and localStorage is persisted
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Force page reload to ensure Navbar shows updated state
        console.log('🚀 Redirecting to catalogues with page reload...')
        window.location.href = '/catalogues'
        return
      } else {
        console.error('❌ Invalid login response:', {
          hasLogin: !!login,
          hasResponse: !!response,
          hasUser: !!(response && response.user),
          response
        })
      }
      
      // Fallback: Redirect to catalogues
      console.log('🚀 Redirecting to catalogues...')
      router.push('/catalogues')

    } catch (error) {
      console.error('❌ Login error:', error)
      setError(error.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1f1f23] rounded-xl border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400">Sign in to access catalogues</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#232326] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#232326] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-orange-400 hover:text-orange-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

