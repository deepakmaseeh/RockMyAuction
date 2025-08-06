'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

export default function SignupPage() {
  const router = useRouter()
  const { setUser } = useUserRole()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch('https://auction-api-n4y1.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Store token and user data
      localStorage.setItem('auth-token', data.token)
      if (data.user) {
        setUser(data.user)
      }

      // Redirect to dashboard
      router.push('/dashboard')
      
    } catch (err) {
      setErrors({ submit: err.message || 'An error occurred during registration' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <img src="/rock_my_auction_logo.png" alt="Rock My Auction" className="h-8 w-auto" />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-8">
        <div className="max-w-md w-full bg-[#18181B] rounded-xl p-8 border border-[#232326]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Join Rock the Auction</h1>
            <p className="text-gray-400">Create your account and start trading</p>
          </div>

          {errors.submit && (
            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-[#333]'
                }`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                  errors.email ? 'border-red-500' : 'border-[#333]'
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                  errors.password ? 'border-red-500' : 'border-[#333]'
                }`}
                placeholder="Create a password"
                required
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#333]'
                }`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
