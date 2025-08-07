'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext' // Adjust path as needed
import { auctionAPI } from '@/lib/auctionAPI' // Adjust path as needed

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUserRole()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      console.log('🔐 Starting login with your API...')
      
      const credentials = {
        email: formData.email.trim(),
        password: formData.password
      }

      console.log('📤 Sending login request:', { email: credentials.email })

      const response = await auctionAPI.login(credentials)
      
      console.log('✅ Login successful:', response)

      // Update context with user data
      if (login) {
        login({
          id: response.user?.id || response.id,
          name: response.user?.name || response.name || 'User',
          email: response.user?.email || response.email || credentials.email,
          role: response.user?.role || response.role || 'buyer'
        })
      }
      
      // Redirect to dashboard
      router.push('/dashboard')

    } catch (error) {
      console.error('❌ Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <div className="bg-[#18181B] p-8 rounded-xl border border-[#232326] w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to Rock My Auction</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600/20 rounded-lg">
            <div className="text-red-400 text-center text-sm">
              ❌ {error}
            </div>
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
              className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
              className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
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

        {/* Test Data Helper (Remove in production) */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Test credentials:</p>
          <p className="text-xs text-gray-400">Email: test@example.com</p>
          <p className="text-xs text-gray-400">Password: test123</p>
        </div>
      </div>
    </div>
  )
}
