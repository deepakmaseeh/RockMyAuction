import Link from 'next/link'

export default function QuickActions({ role }) {
  const sellerActions = [
    { name: 'List New Item', href: '/seller/new-auction', icon: '➕', color: 'bg-green-600' },
    { name: 'Manage Listings', href: '/seller/active-auctions', icon: '📋', color: 'bg-blue-600' },
    { name: 'View Analytics', href: '/seller/analytics', icon: '📊', color: 'bg-purple-600' },
    { name: 'Messages', href: '/messages', icon: '💬', color: 'bg-orange-600' }
  ]

  const buyerActions = [
    { name: 'Browse Auctions', href: '/auctions', icon: '🔍', color: 'bg-blue-600' },
    { name: 'My Watchlist', href: '/watchlist', icon: '👁️', color: 'bg-green-600' },
    { name: 'Bid History', href: '/bids', icon: '🏷️', color: 'bg-purple-600' },
    { name: 'Messages', href: '/messages', icon: '💬', color: 'bg-orange-600' }
  ]

  const actions = role === 'seller' ? sellerActions : buyerActions

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-3 p-4 rounded-lg bg-[#232326] hover:bg-[#2a2a2e] transition group"
          >
            <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
              <span className="text-white text-lg">{action.icon}</span>
            </div>
            <span className="font-medium text-white text-sm">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

