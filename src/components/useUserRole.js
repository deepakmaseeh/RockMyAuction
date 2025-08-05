// src/hooks/useUserRole.js
'use client'
import { useState, useEffect } from 'react'

export default function useUserRole() {
  const [currentRole, setCurrentRole] = useState('buyer') // 'buyer' or 'seller'
  const [user, setUser] = useState(null)

  const switchRole = (newRole) => {
    setCurrentRole(newRole)
    // Save preference to localStorage or user settings
    localStorage.setItem('preferredRole', newRole)
  }

  return {
    currentRole,
    switchRole,
    user,
    isBuyer: currentRole === 'buyer',
    isSeller: currentRole === 'seller'
  }
}
