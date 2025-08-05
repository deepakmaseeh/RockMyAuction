'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('seller')
  const [user, setUser] = useState({
    name: 'Alex Thompson',
    email: 'alex@example.com',
    avatar: '/avatars/user.jpg',
    joinedDate: '2023',
    rating: 4.8,
    totalSales: 145,
    totalPurchases: 89,
    verified: true
  })

  useEffect(() => {
    const savedRole = localStorage.getItem('preferredRole')
    if (savedRole && (savedRole === 'buyer' || savedRole === 'seller')) {
      setCurrentRole(savedRole)
    }
  }, [])

  const switchRole = (newRole) => {
    setCurrentRole(newRole)
    localStorage.setItem('preferredRole', newRole)
  }

  const value = {
    currentRole,
    switchRole,
    user,
    setUser,
    isBuyer: currentRole === 'buyer',
    isSeller: currentRole === 'seller',
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useUserRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useUserRole must be used within a RoleProvider')
  }
  return context
}
