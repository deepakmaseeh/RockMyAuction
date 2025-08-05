// src/components/RoleSwitcher.js
'use client'
import { useUserRole } from '../hooks/useUserRole'

export default function RoleSwitcher() {
  const { currentRole, switchRole, isBuyer, isSeller } = useUserRole()

  return (
    <div className="bg-[#18181B] rounded-lg p-1 flex">
      <button
        onClick={() => switchRole('buyer')}
        className={`px-4 py-2 rounded text-sm font-medium transition ${
          isBuyer 
            ? 'bg-orange-500 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🛒 Buyer Mode
      </button>
      <button
        onClick={() => switchRole('seller')}
        className={`px-4 py-2 rounded text-sm font-medium transition ${
          isSeller 
            ? 'bg-orange-500 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🏪 Seller Mode
      </button>
    </div>
  )
}
