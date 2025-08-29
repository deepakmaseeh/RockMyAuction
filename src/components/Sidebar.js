'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUserRole } from '../contexts/RoleContext'

function RoleSwitcher() {
  const { currentRole, switchRole, user } = useUserRole()
  
  return (
    <div className="mb-4 sm:mb-6">
      {/* User Profile Section */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-[#232326] rounded-lg">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white truncate text-sm sm:text-base">{user?.name || 'User'}</div>
          <div className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
        </div>
        {user?.verified && (
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Role Switch */}
      <div className="bg-[#232326] rounded-lg p-1 flex">
        <button
          onClick={() => switchRole('buyer')}
          className={`flex-1 px-2 sm:px-3 py-2 rounded text-xs sm:text-sm font-medium transition touch-manipulation ${
            currentRole === 'buyer' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white active:bg-[#2a2a2e]'
          }`}
        >
          <span className="block sm:inline">🛒</span>
          <span className="block sm:inline sm:ml-1">Buyer</span>
        </button>
        <button
          onClick={() => switchRole('seller')}
          className={`flex-1 px-2 sm:px-3 py-2 rounded text-xs sm:text-sm font-medium transition touch-manipulation ${
            currentRole === 'seller' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white active:bg-[#2a2a2e]'
          }`}
        >
          <span className="block sm:inline">🏪</span>
          <span className="block sm:inline sm:ml-1">Seller</span>
        </button>
      </div>
    </div>
  )
}

function DynamicNavigation({ onNavigate }) {
  const { isBuyer, currentRole } = useUserRole()
  const pathname = usePathname()

  const sellerLinks = [
    { href: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: '📊' },
    { href: '/seller/new-auction', label: 'List New Item', shortLabel: 'Add', icon: '➕', highlight: true },
    { href: '/seller/active-auctions', label: 'Active Listings', shortLabel: 'Active', icon: '🔥' },
    { href: '/seller/analytics', label: 'Analytics', shortLabel: 'Stats', icon: '📈' },
    { href: '/seller/earnings', label: 'Earnings', shortLabel: 'Money', icon: '💰' },
    { href: '/messages', label: 'Messages', shortLabel: 'Chat', icon: '💬' },
    { href: '/wallet', label: 'Wallet', shortLabel: 'Wallet', icon: '💰' },
    { href: '/settings', label: 'Settings', shortLabel: 'Config', icon: '⚙️' },
    { href: '/profile', label: 'My Profile', shortLabel: 'Profile', icon: '👤' },
  ]

  const buyerLinks = [
    { href: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: '📊' },
    { href: '/auctions', label: 'Browse Auctions', shortLabel: 'Browse', icon: '🔍', highlight: true },
    { href: '/watchlist', label: 'My Wishlist', shortLabel: 'Watch', icon: '👁️' },
    { href: '/bids', label: 'My Bids', shortLabel: 'Bids', icon: '🏷️' },
    { href: '/purchases', label: 'My Purchases', shortLabel: 'Bought', icon: '📦' },
    { href: '/messages', label: 'Messages', shortLabel: 'Chat', icon: '💬' },
    { href: '/wallet', label: 'Wallet', shortLabel: 'Wallet', icon: '💰' },
    { href: '/settings', label: 'Settings', shortLabel: 'Config', icon: '⚙️' },
    { href: '/profile', label: 'My Profile', shortLabel: 'Profile', icon: '👤' },
  ]
  
  const links = isBuyer ? buyerLinks : sellerLinks

  return (
    <nav className="flex flex-col gap-1 sm:gap-2 flex-1">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 sm:px-0">
        {currentRole} Panel
      </div>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition touch-manipulation group ${
            pathname === item.href
              ? 'bg-orange-500 text-white shadow-sm'
              : item.highlight
              ? 'bg-green-600 hover:bg-green-700 text-white active:bg-green-800'
              : 'text-gray-300 hover:bg-[#232326] hover:text-white active:bg-[#2a2a2e]'
          }`}
        >
          <span className="text-base sm:text-lg flex-shrink-0">{item.icon}</span>
          <span className="font-medium text-sm sm:text-base truncate">
            <span className="sm:hidden">{item.shortLabel}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const { user } = useUserRole()
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#18181B] text-white p-2 rounded-lg border border-[#232326] shadow-lg touch-manipulation"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 z-40 lg:z-auto
        w-64 sm:w-72 lg:w-64 min-h-screen
        bg-[#18181B] p-3 sm:p-4 lg:p-6 
        flex flex-col border-r border-[#232326]
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <Link 
          href="/" 
          className="font-bold text-lg sm:text-xl lg:text-2xl text-orange-500 mb-6 sm:mb-8 flex items-center justify-center lg:justify-start gap-2 touch-manipulation"
          onClick={closeSidebar}
        >
          <img 
            src="/RMA-Logo.png" 
            alt="Rock My Auction" 
            className="w-24 sm:w-28 lg:w-32 h-auto" 
          />
        </Link>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Navigation */}
        <DynamicNavigation onNavigate={closeSidebar} />

        {/* Stats Summary */}
        <div className="mt-auto pt-4 sm:pt-6 border-t border-[#232326]">
          <div className="bg-[#232326] rounded-lg p-3 sm:p-4 space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Rating</span>
              <span className="text-orange-400 font-medium">⭐ {user?.rating || '5.0'}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Total Sales</span>
              <span className="text-white font-medium">{user?.totalSales || '0'}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Member Since</span>
              <span className="text-gray-300 truncate">{user?.joinedDate || '2024'}</span>
            </div>
          </div>
          
          <Link 
            href="/help-center" 
            className="block text-center text-orange-400 hover:text-orange-300 active:text-orange-500 text-xs sm:text-sm font-medium mt-3 sm:mt-4 transition touch-manipulation py-2"
            onClick={closeSidebar}
          >
            Need Help? Contact Support →
          </Link>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden mt-4 w-full py-2 px-4 bg-[#232326] text-gray-400 rounded-lg text-sm touch-manipulation"
        >
          Close Menu
        </button>
      </aside>
    </>
  )
}
