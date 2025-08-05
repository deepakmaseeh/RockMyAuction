'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUserRole } from '../contexts/RoleContext'

function RoleSwitcher() {
  const { currentRole, switchRole, user } = useUserRole()
  
  return (
    <div className="mb-6">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-[#232326] rounded-lg">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white truncate">{user.name}</div>
          <div className="text-xs text-gray-400 truncate">{user.email}</div>
        </div>
        {user.verified && (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Role Switch */}
      <div className="bg-[#232326] rounded-lg p-1 flex">
        <button
          onClick={() => switchRole('buyer')}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
            currentRole === 'buyer' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          🛒 Buyer
        </button>
        <button
          onClick={() => switchRole('seller')}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
            currentRole === 'seller' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          🏪 Seller
        </button>
      </div>
    </div>
  )
}

function DynamicNavigation() {
  const { isBuyer, currentRole } = useUserRole()
  const pathname = usePathname()

  const sellerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/seller/new-auction', label: 'List New Item', icon: '➕', highlight: true },
    { href: '/seller/active-auctions', label: 'Active Listings', icon: '🔥' }, // Links to active listings
    { href: '/seller/analytics', label: 'Analytics', icon: '📈' }, // Links to analytics
    { href: '/seller/earnings', label: 'Earnings', icon: '💰' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
    { href: '/profile', label: 'My Profile', icon: '👤' },

  ]

  const buyerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/auctions', label: 'Browse Auctions', icon: '🔍', highlight: true },
    { href: '/watchlist', label: 'My Watchlist', icon: '👁️' },
    { href: '/bids', label: 'My Bids', icon: '🏷️' },
    { href: '/purchases', label: 'My Purchases', icon: '📦' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
    { href: '/profile', label: 'My Profile', icon: '👤' },

  ]
  
  const links = isBuyer ? buyerLinks : sellerLinks

  return (
    <nav className="flex flex-col gap-2 flex-1">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {currentRole} Panel
      </div>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 py-3 px-4 rounded-lg transition group ${
            pathname === item.href
              ? 'bg-orange-500 text-white'
              : item.highlight
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'text-gray-300 hover:bg-[#232326] hover:text-white'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const { user } = useUserRole()

  return (
    <aside className="w-64 min-h-screen bg-[#18181B] p-6 flex flex-col border-r border-[#232326]">
      {/* Logo */}
      <Link href="/" className="font-bold text-2xl text-orange-500 mb-8 flex items-center gap-2">
        <span><img src="/RMA-Logo.png" alt="Logo" className="w-35 content-center" /></span>
        
      </Link>

      {/* Role Switcher */}
      <RoleSwitcher />

      {/* Navigation */}
      <DynamicNavigation />

      {/* Stats Summary */}
      <div className="mt-auto pt-6 border-t border-[#232326]">
        <div className="bg-[#232326] rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rating</span>
            <span className="text-orange-400 font-medium">⭐ {user.rating}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Sales</span>
            <span className="text-white font-medium">{user.totalSales}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Member Since</span>
            <span className="text-gray-300">{user.joinedDate}</span>
          </div>
        </div>
        
        <Link href="/help" className="block text-center text-orange-400 hover:text-orange-300 text-sm font-medium mt-4 transition">
          Need Help? Contact Support →
        </Link>
      </div>
    </aside>
  )
}
