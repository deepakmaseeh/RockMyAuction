// src/components/RoleBasedNav.js
import { useUserRole } from '../hooks/useUserRole'
import Link from 'next/link'

export default function RoleBasedNav() {
  const { isBuyer, isSeller } = useUserRole()

  const buyerLinks = [
    { href: '/auctions', label: 'Browse Auctions', icon: '🔍' },
    { href: '/watchlist', label: 'Watchlist', icon: '👁️' },
    { href: '/bids', label: 'My Bids', icon: '🏷️' },
    { href: '/purchases', label: 'Purchases', icon: '📦' }
  ]

  const sellerLinks = [
    { href: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/seller/new-auction', label: 'List Item', icon: '➕' },
    { href: '/seller/active', label: 'Active Listings', icon: '🔥' },
    { href: '/seller/analytics', label: 'Analytics', icon: '📈' }
  ]

  const links = isBuyer ? buyerLinks : sellerLinks

  return (
    <nav className="space-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#232326] hover:text-white rounded-lg transition"
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
