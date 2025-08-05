import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth-token')?.value
  const isLoggedIn = !!authToken
  
  // Public routes that don't require authentication
  const publicPaths = [
    '/login', 
    '/register', 
    '/api/auth', 
    '/', 
    '/auctions', 
    '/about',
    '/dashboard'  // ← ADD THIS LINE to make dashboard public
  ]
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Protected routes that require authentication (removed /dashboard from here)
  const protectedPaths = [
    '/seller', 
    '/buyer', 
    '/profile', 
    '/settings',
    '/messages'
  ]
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // If user is on login page and already logged in, redirect to dashboard
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is trying to access protected route without auth, redirect to login
  if (isProtectedPath && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
  }
  
  // Allow all other requests
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
