'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // For password visibility toggle
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Static credentials for testing
  const STATIC_EMAIL = 'admin@rockmyauction.com'
  const STATIC_PASSWORD = 'admin123'

  function validateForm(email, password) {
    const errors = {}
    
    if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setValidationErrors({})
    setLoading(true)
    
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    const errors = validateForm(email, password)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setLoading(false)
      return
    }
    
    try {
      // Check against static credentials
      if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Store user info in localStorage (for demo purposes)
        localStorage.setItem('user', JSON.stringify({
          email: email,
          name: 'Admin User',
          role: 'seller'
        }))
        
        // Redirect to dashboard
        window.location.push('/dashboard')
      } else {
        setError('Invalid email or password. Try: admin@rockmyauction.com / admin123')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#18181B] p-8 rounded-2xl w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-white text-center">Welcome Back</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">Enter your credentials to access your account.</p>
      
      {/* Demo credentials info */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
        <h4 className="text-orange-400 font-semibold text-sm mb-1">Demo Credentials:</h4>
        <p className="text-gray-300 text-sm">Email: admin@rockmyauction.com</p>
        <p className="text-gray-300 text-sm">Password: admin123</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="email">Email</label>
          <input
            className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            type="email"
            name="email"
            id="email"
            placeholder="admin@rockmyauction.com"
            required
          />
          {validationErrors.email && <div className="text-red-500 text-sm mt-1">{validationErrors.email}</div>}
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1" htmlFor="password">Password</label>
          <div className="relative">
            <input
              className="w-full bg-[#252529] border border-[#393940] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="admin123"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-300"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? (
                // Eye-off icon SVG
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                // Eye icon SVG
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {validationErrors.password && <div className="text-red-500 text-sm mt-1">{validationErrors.password}</div>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </button>
        
        {error && (
          <div className="text-red-500 text-sm bg-red-900/10 border border-red-500/20 p-3 rounded">
            {error}
          </div>
        )}
      </form>
      
      <div className="flex justify-between mt-4 mb-4">
        <Link href="/auth/forgot-password" className="text-xs text-orange-400 hover:underline">
          Forgot password?
        </Link>
      </div>
      
      <div className="flex items-center mb-4">
        <span className="flex-1 border-t border-gray-600" />
        <span className="px-3 text-gray-500 text-xs">or continue with</span>
        <span className="flex-1 border-t border-gray-600" />
      </div>
      
      <button 
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-[#212126] hover:bg-[#18181B] border border-gray-700 py-2 rounded font-medium text-white mb-4 transition"
        onClick={() => setError('Google login not implemented yet')}
      >
        {/* Google icon SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Log in with Google
      </button>
      
      <div className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-orange-400 hover:underline font-medium">
          Sign Up
        </Link>
      </div>
    </div>
  )
}


// 'use client'

// import { useRouter } from 'next/navigation'

// export default function LoginForm() {
//   const router = useRouter()

//   function handleLogin() {
//     router.push('/dashboard')
//   }

//   return (
//     <div className="bg-[#18181B] p-8 rounded-2xl w-full max-w-md shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-white text-center">
//         Welcome to RockMyAuction
//       </h2>
//       <p className="text-gray-400 text-sm mb-8 text-center">
//         Click below to access your dashboard
//       </p>
      
//       <button
//         onClick={handleLogin}
//         className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-orange-400"
//       >
//         Go to Dashboard
//       </button>
//     </div>
//   )
// }
