// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const { pathname } = request.nextUrl
  
//   // Get auth token from cookies
//   const authToken = request.cookies.get('auth-token')?.value
//   const isLoggedIn = !!authToken
  
//   // Public routes that don't require authentication
//   const publicPaths = [
//     '/login', 
//     '/register', 
//     '/api/auth', 
//     '/', 
//     '/auctions', 
//     '/about',
//     '/dashboard',
//     '/seller/new-auction',
//     '/watchlist',
//     '/bids',
//      '/seller/analytics',
//      '/seller/active-auctions',
//     '/profile',  
//     '/admin',
//     '/settings',
//     '/messages'  // ← ADD THIS LINE to make new auction page public
//   ]
//   const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
//   // Protected routes that require authentication (removed /seller and /dashboard from here)
//   const protectedPaths = [
//     '/buyer', 
//     // '/profile', 
//     // '/settings',
//     // '/messages'
//   ]
//   const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
//   // If user is on login page and already logged in, redirect to dashboard
//   if (pathname === '/login' && isLoggedIn) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }
  
//   // If user is trying to access protected route without auth, redirect to login
//   if (isProtectedPath && !isLoggedIn) {
//     const callbackUrl = encodeURIComponent(pathname)
//     return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
//   }
  
//   // Allow all other requests
//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }


import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // ✅ FIXED: Skip middleware entirely for API routes to prevent CORS issues
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // ✅ FIXED: Skip middleware for static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }
  
  // Get auth token from cookies (we'll set this from frontend)
  const authToken = request.cookies.get('auth-token')?.value
  const isLoggedIn = !!authToken
  
  console.log('🔍 Middleware:', {
    pathname,
    isLoggedIn: isLoggedIn,
    hasToken: !!authToken
  })
  
  // ✅ FIXED: Properly defined public paths (pages that don't need auth)
  const publicPaths = [
    '/',
    '/login', 
    '/signup',
    '/auctions',
    '/about',
    '/terms',
    '/privacy'
  ]
  
  // ✅ FIXED: Protected paths (pages that need auth)
  const protectedPaths = [
    '/dashboard',
    '/seller',
    '/buyer', 
    '/profile', 
    '/settings',
    '/messages',
    '/watchlist',
    '/bids',
    '/admin'
  ]
  
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // If user is logged in and tries to access login/signup, redirect to dashboard
  if ((pathname === '/login' || pathname === '/signup') && isLoggedIn) {
    console.log('🔄 Redirecting logged-in user from auth page to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user tries to access protected page without auth, redirect to login
  // if (isProtectedPath && !isLoggedIn) {
  //   console.log('🔒 Redirecting unauthenticated user to login')
  //   const callbackUrl = encodeURIComponent(pathname)
  //   return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
  // }
  
  // Allow all other requests
  return NextResponse.next()
}

// ✅ FIXED: Corrected regex syntax and excluded API routes completely
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (starts with /api/)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - files with extensions (.png, .jpg, etc.)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
