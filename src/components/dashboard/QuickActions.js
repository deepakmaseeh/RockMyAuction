import Link from 'next/link'

export default function QuickActions({ role }) {
  const sellerActions = [
    { name: 'List New Item', shortName: 'Add Item', href: '/seller/new-auction', icon: '➕', color: 'bg-green-600' },
    { name: 'Manage Listings', shortName: 'Manage', href: '/seller/active-auctions', icon: '📋', color: 'bg-blue-600' },
    { name: 'View Analytics', shortName: 'Analytics', href: '/seller/analytics', icon: '📊', color: 'bg-purple-600' },
    { name: 'Messages', shortName: 'Messages', href: '/messages', icon: '💬', color: 'bg-orange-600' }
  ]

  const buyerActions = [
    { name: 'Browse Auctions', shortName: 'Browse', href: '/auctions', icon: '🔍', color: 'bg-blue-600' },
    { name: 'My Watchlist', shortName: 'Watchlist', href: '/watchlist', icon: '👁️', color: 'bg-green-600' },
    { name: 'Bid History', shortName: 'Bids', href: '/bids', icon: '🏷️', color: 'bg-purple-600' },
    { name: 'Messages', shortName: 'Messages', href: '/messages', icon: '💬', color: 'bg-orange-600' }
  ]

  const actions = role === 'seller' ? sellerActions : buyerActions

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Quick Actions</h3>
      
      {/* Mobile: Single column, Tablet+: 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-[#232326] hover:bg-[#2a2a2e] active:bg-[#323238] transition-all group touch-manipulation"
          >
            <div className={`p-2 sm:p-2.5 rounded-lg ${action.color} group-hover:scale-110 group-active:scale-105 transition-transform flex-shrink-0`}>
              <span className="text-white text-base sm:text-lg">{action.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              {/* Show short name on very small screens, full name on larger screens */}
              <span className="font-medium text-white text-sm sm:text-base block sm:hidden truncate">
                {action.shortName}
              </span>
              <span className="font-medium text-white text-sm sm:text-base hidden sm:block truncate">
                {action.name}
              </span>
            </div>
            
            {/* Optional arrow indicator for better UX */}
            <div className="text-gray-400 group-hover:text-orange-400 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: Show role indicator */}
      <div className="mt-4 sm:hidden">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span>{role === 'seller' ? 'Seller' : 'Buyer'} Dashboard</span>
        </div>
      </div>
    </div>
  )
}
