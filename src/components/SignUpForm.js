'use client'

import { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirm = formData.get('confirmPassword')
    const userType = formData.get('userType')

    if (!name || !email || !password || !confirm) {
      setError("All fields are required")
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }
  
    // TODO: Replace this with real API for user creation
    // For now, just auto-redirect to verification step
    router.push('/auth/verification')
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
    setLoading(false)
  }

  return (
    <div className="bg-[#18181B] p-8 rounded-2xl w-full max-w-md mx-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-white text-center">Create Your Account</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">Join Rock the Auction to buy or sell unique items.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="name">Full Name</label>
          <input
            className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            name="name"
            id="name"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="email">Email</label>
          <input
            className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            type="email"
            name="email"
            id="email"
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="password">Password</label>
          <input
            className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            type="password"
            name="password"
            id="password"
            placeholder="********"
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="********"
            minLength={6}
            required
          />
        </div>
        <div className="flex space-x-4 justify-center text-white">
          <label className="flex items-center space-x-1">
            <input type="radio" name="userType" value="seller" className="accent-orange-500" required />
            <span>Seller</span>
          </label>
          <label className="flex items-center space-x-1">
            <input type="radio" name="userType" value="buyer" className="accent-orange-500" required />
            <span>Buyer</span>
          </label>
        </div>
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded font-semibold text-white transition mt-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue to Verification"}
        </button>
        {error && <div className="text-red-500 text-sm bg-red-900/10 p-2 rounded">{error}</div>}
      </form>
      <div className="flex items-center my-4">
        <span className="flex-1 border-t border-gray-600" />
        <span className="px-2 text-gray-500 text-xs">or sign up with</span>
        <span className="flex-1 border-t border-gray-600" />
      </div>
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 bg-[#212126] hover:bg-[#18181B] border border-gray-700 py-2 rounded font-medium text-white transition mb-3"
        disabled={loading}
      >
        <svg width="18" height="18" fill="currentColor" aria-hidden="true"><g><path fill="#FFC107" d="M17.39 7.73h-1.62V7.34H9v3.32h6.03c-.53 1.4-1.94 2.45-3.53 2.45A4.18 4.18 0 1 1 14.97 6.4l2.09-2.02A7.25 7.25 0 0 0 9 2.1a7.2 7.2 0 1 0 0 14.39c3.58 0 6.78-2.79 7.14-6.39a6.8 6.8 0 0 0-.75-2.37z"/><path fill="#FF3D00" d="M2.32 4.4l2.52 1.85A4.18 4.18 0 0 1 9 4.5c.84 0 1.64.27 2.3.78l2.29-1.78A7.15 7.15 0 0 0 9 2.1a7.22 7.22 0 0 0-6.74 4.3z"/><path fill="#4CAF50" d="M9 16.5c1.76 0 3.38-.59 4.63-1.6l-2.18-1.8A4.19 4.19 0 0 1 9 13.5a4.19 4.19 0 0 1-3.92-2.69l-2.5 1.93A7.21 7.21 0 0 0 9 16.5z"/><path fill="#1976D2" d="M17.39 7.73h-1.62V7.34H9v3.32h6.03c-.24.66-.64 1.26-1.18 1.74V14.7h2.89c.96-.98 1.53-2.33 1.53-3.7 0-.55-.05-1.1-.15-1.64z"/></g></svg>
        Continue with Google
      </button>
      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <a href="/auth/login" className="text-orange-400 hover:underline">Log In</a>
      </div>
    </div>
  )
}
