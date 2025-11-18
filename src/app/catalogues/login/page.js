'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/contexts/RoleContext'

// Redirect to actual login page - no demo users
export default function StaticLogin() {
  const router = useRouter()
  const { isAuthenticated } = useUserRole()

  useEffect(() => {
    if (isAuthenticated) {
      // Already logged in - go to catalogues
      router.push('/catalogues')
    } else {
      // Not logged in - redirect to real login page
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1f1f23] rounded-xl border border-gray-700 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  )
}

