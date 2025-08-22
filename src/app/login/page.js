// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { useUserRole } from '@/contexts/RoleContext'
// import auctionAPI from '@/lib/auctionAPI' // ✅ FIXED: Proper import
// import Navbar from '@/components/Navbar'

// export default function LoginPage() {
//   const router = useRouter()
//   const { setUser } = useUserRole() // ✅ FIXED: Use setUser instead of login
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     setError('') // Clear error when user types
//   }

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     // Basic validation
//     if (!formData.email.trim() || !formData.password) {
//       setError('Please enter both email and password')
//       setLoading(false)
//       return
//     }

//     try {
//       console.log('🔐 Starting login with excellwebsolution.com API...')
      
//       // ✅ FIXED: Use the singleton auctionAPI instance directly
//       const response = await auctionAPI.login({
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password
//       })

//       console.log('✅ Login successful:', response)

//       // ✅ FIXED: Set user data from API response format
//       const user = {
//         id: response._id, // API returns _id
//         name: response.name,
//         email: response.email,
//         // Add some default values since API doesn't provide them
//         avatar: '/avatars/user.jpg',
//         joinedDate: '2024',
//         rating: 4.5,
//         totalSales: 0,
//         totalPurchases: 0,
//         verified: false
//       }

//       setUser(user)
//       console.log('👤 User set in context:', user)

//       // Show success message
//       alert('Login successful!')
      
//       // Redirect to dashboard
//       router.push('/dashboard')
      
//     } catch (err) {
//       console.error('❌ Login error:', err)
//       setError(err.message || 'An error occurred during login')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#09090B] text-white">
//       <Navbar />

//       <div className="flex items-center justify-center min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] px-4 sm:px-6 py-6 sm:py-8">
//         <div className="max-w-md w-full bg-[#18181B] rounded-lg sm:rounded-xl p-6 sm:p-8 border border-[#232326] shadow-xl">
//           {/* Header */}
//           <div className="text-center mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
//             <p className="text-gray-400 text-sm sm:text-base">Sign in to your Rock the Auction account</p>
//           </div>

//           {/* Error Alert */}
//           {error && (
//             <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
//               <div className="flex items-start gap-2">
//                 <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors text-sm sm:text-base hover:border-[#555]"
//                 placeholder="Enter your email"
//                 autoComplete="email"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 pr-12 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors text-sm sm:text-base hover:border-[#555]"
//                   placeholder="Enter your password"
//                   autoComplete="current-password"
//                   required
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors touch-manipulation p-1"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     {showPassword ? (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//                     ) : (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     )}
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <Link href="/forgot-password" className="text-orange-400 hover:text-orange-300 transition-colors">
//                   Forgot password?
//                 </Link>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 sm:py-3.5 rounded-lg font-semibold transition-colors touch-manipulation text-sm sm:text-base shadow-lg hover:shadow-xl disabled:shadow-none"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           {/* Footer Links */}
//           <div className="mt-6 text-center space-y-3">
//             <p className="text-gray-400 text-sm">
//               Don't have an account?{' '}
//               <Link href="/signup" className="text-orange-400 hover:text-orange-300 active:text-orange-500 font-medium transition-colors touch-manipulation">
//                 Sign up here
//               </Link>
//             </p>
//           </div>

//           {/* Test Helper */}
//           <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
//             <p className="text-xs text-gray-500 mb-2">Demo credentials:</p>
//             <p className="text-xs text-gray-400">Email: demo@example.com</p>
//             <p className="text-xs text-gray-400">Password: demo123</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


/////////////////////////////
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import auctionAPI from '@/lib/auctionAPI'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUserRole()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // Clear error when user types
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Starting login...')
      
      const response = await auctionAPI.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })

      console.log('✅ Login successful:', response)

      // ✅ FIXED: Set user data in context properly
      const user = {
        id: response._id,
        name: response.name,
        email: response.email,
        avatar: '/avatars/user.jpg',
        joinedDate: '2024',
        rating: 4.5,
        totalSales: 0,
        totalPurchases: 0,
        verified: false
      }

      // Set user in context
      setUser(user)
      console.log('👤 User set in context:', user)

      // ✅ FIXED: Force redirect using window.location for immediate effect
      console.log('🏠 Redirecting to dashboard...')
      
      // Show success message briefly then redirect
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)
      
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-md w-full bg-[#18181B] rounded-lg sm:rounded-xl p-6 sm:p-8 border border-[#232326] shadow-xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm sm:text-base">Sign in to your Rock the Auction account</p>
          </div>

          {/* Success Message */}
          {loading && (
            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-green-400 text-sm">Login successful! Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors text-sm sm:text-base hover:border-[#555]"
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 pr-12 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors text-sm sm:text-base hover:border-[#555]"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors touch-manipulation p-1"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="text-orange-400 hover:text-orange-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 sm:py-3.5 rounded-lg font-semibold transition-colors touch-manipulation text-sm sm:text-base shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-orange-400 hover:text-orange-300 active:text-orange-500 font-medium transition-colors touch-manipulation">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
