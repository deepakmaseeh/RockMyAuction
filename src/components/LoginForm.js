'use client'

import { useState } from 'react'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // For password visibility toggle
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      window.location.href = '/dashboard'
    } else {
      const { error } = await res.json()
      setError(error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#18181B] p-8 rounded-2xl w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-white text-center">Welcome Back</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">Enter your credentials to access your account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="email">Email</label>
          <input
            className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            type="email"
            name="email"
            id="email"
            placeholder="your@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="password">Password</label>
          <div className="relative">
            <input
              className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="********"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-400"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? (
                // Eye-off icon SVG (for better UX, inline svg used directly)
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10 10 0 0112 20c-5.2 0-9.4-3.75-10-8 .24-1.55.74-3.01 1.48-4.26m1.52-2.22a9.977 9.977 0 014.24-1.48m8.76 8.76A9.977 9.977 0 0020 12m-1.5 2.22c.74-1.25 1.24-2.7 1.5-4.22-.6-4.25-4.8-8-10-8a10 10 0 00-6.95 2.94m2.24 2.24" /><path d="M1 1l20 20" /></svg>
              ) : (
                // Eye icon SVG
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="12" rx="10" ry="8" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded font-semibold text-white transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <div className="text-red-500 text-sm bg-red-900/10 p-2 rounded">{error}</div>}
      </form>
      <div className="flex justify-between mt-3 mb-3">
        <a href="#" className="text-xs text-orange-400 hover:underline">Forgot password?</a>
      </div>
      <div className="flex items-center mb-3">
        <span className="flex-1 border-t border-gray-600" />
        <span className="px-2 text-gray-500 text-xs">or continue with</span>
        <span className="flex-1 border-t border-gray-600" />
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-[#212126] hover:bg-[#18181B] border border-gray-700 py-2 rounded font-medium text-white mb-4 transition">
        {/* Google icon SVG */}
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 48 48"><g><path fill="#FFC107" d="M43.6 20.46h-1.87V20H24v8h11.34c-1.64 4.36-5.68 7.5-10.34 7.5A11.5 11.5 0 1 1 35.08 17.5l5.71-5.52A19.76 19.76 0 0024 4.5C13.38 4.5 4.5 13.38 4.5 24S13.38 43.5 24 43.5c10.18 0 18.75-7.76 18.75-19.25 0-1.25-.13-2.21-.35-3.79z"/><path fill="#FF3D00" d="M6.25 14.15l6.54 4.8A11.5 11.5 0 0 1 24 12.5c2.32 0 4.5.76 6.29 2.15l6.25-4.84C33.36 6.75 28.89 4.5 24 4.5c-6.97 0-13.06 3.83-17.08 9.65z"/><path fill="#4CAF50" d="M24 43.5c4.84 0 9.29-1.63 12.75-4.41l-6-4.92A11.5 11.5 0 0 1 24 35.5c-4.61 0-8.54-2.89-10.17-7.22l-6.46 5C9.75 39.36 16.41 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.46h-1.87V20H24v8h11.34c-1.16 2.91-3.31 4.91-6.17 5.97v4.92h9.99C41.74 36.88 43.5 30.5 43.5 24c0-1.25-.12-2.46-.35-3.79z"/></g></svg>
        Log in with Google
      </button>
      <div className="text-center text-sm text-gray-400">
        Don &apos;t have an account?{' '}
        <a href="/auth/register" className="text-orange-400 hover:underline">Sign Up</a>
      </div>
    </div>
  )
}
