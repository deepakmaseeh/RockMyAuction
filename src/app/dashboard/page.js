'use client'

import { useUserRole } from '@/contexts/RoleContext'
import dynamic from 'next/dynamic'

// ─────────────────────────────────────────
// 1.  SAFER SIDEBAR IMPORT  (works for both
//     default and named exports, skips SSR)
const Sidebar = dynamic(
  () => import('@/components/Sidebar').then(m => m.default ?? m.Sidebar),
  { ssr: false }
)

// ─────────────────────────────────────────
// 2.  INLINE HELPERS (unchanged)
function StatsCard({ title, value, change, changeType, icon: Icon, color = 'orange' }) {
  const isPositive = changeType === 'positive'
  const colorClasses = {
    orange: 'bg-orange-500/20 text-orange-400',
    blue:   'bg-blue-500/20  text-blue-400',
    green:  'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red:    'bg-red-500/20   text-red-400'
  }

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] hover:border-orange-500/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}

function RecentActivity({ activities, type }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <h3 className="text-xl font-bold mb-6">Recent {type === 'seller' ? 'Sales' : 'Bids'}</h3>
      <div className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#232326] last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#232326] flex items-center justify-center">
                <span className="text-orange-400 text-sm">📦</span>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">{a.title}</h4>
                <p className="text-xs text-gray-400">{a.time}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">${a.amount.toLocaleString()}</div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  a.status === 'won'
                    ? 'bg-green-600 text-green-100'
                    : a.status === 'sold'
                    ? 'bg-blue-600 text-blue-100'
                    : a.status === 'bidding'
                    ? 'bg-orange-600 text-orange-100'
                    : 'bg-gray-600 text-gray-100'
                }`}
              >
                {a.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickActions({ role }) {
  const seller = [
    { name: 'List New Item',     href: '/seller/new-auction', icon: '➕', color: 'bg-green-600' },
    { name: 'Manage Listings',   href: '/seller/active-auctions', icon: '📋', color: 'bg-blue-600' },
    { name: 'View Analytics',    href: '/seller/analytics', icon: '📊', color: 'bg-purple-600' },
    { name: 'Messages',          href: '/messages', icon: '💬', color: 'bg-orange-600' }
  ]
  const buyer = [
    { name: 'Browse Auctions',   href: '/auctions', icon: '🔍', color: 'bg-blue-600' },
    { name: 'My Watchlist',      href: '/watchlist', icon: '👁️', color: 'bg-green-600' },
    { name: 'Bid History',       href: '/bids', icon: '🏷️', color: 'bg-purple-600' },
    { name: 'Messages',          href: '/messages', icon: '💬', color: 'bg-orange-600' }
  ]
  const actions = role === 'seller' ? seller : buyer

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => (window.location.href = a.href)}
            className="flex items-center gap-3 p-4 rounded-lg bg-[#232326] hover:bg-[#2a2a2e] transition group"
          >
            <div className={`p-2 rounded-lg ${a.color} group-hover:scale-110 transition-transform`}>
              <span className="text-white text-lg">{a.icon}</span>
            </div>
            <span className="font-medium text-white text-sm">{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function PerformanceChart({ role }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">{role === 'seller' ? 'Sales' : 'Bidding'} Performance</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">$12,845</span>
          <span className="text-green-400 text-sm">+12.5%</span>
        </div>

        {/* simple bar chart */}
        <div className="h-32 bg-[#232326] rounded-lg flex items-end justify-around p-4">
          {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
            <div key={i} className="bg-orange-500 rounded-t w-8 hover:bg-orange-400" style={{ height: `${h}%` }} />
          ))}
        </div>

        <div className="text-sm text-gray-400">
          {role === 'seller' ? 'Total Revenue' : 'Total Bids Placed'} – Last 7 days
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 3.  ICON FALLBACKS
const CurrencyDollarIcon = ({ className }) => <span className={className}>💰</span>
const ShoppingBagIcon   = ({ className }) => <span className={className}>🛍️</span>
const EyeIcon           = ({ className }) => <span className={className}>👁️</span>
const TrophyIcon        = ({ className }) => <span className={className}>🏆</span>
const HeartIcon         = ({ className }) => <span className={className}>❤️</span>
const ClockIcon         = ({ className }) => <span className={className}>⏰</span>

// ─────────────────────────────────────────
// 4.  MOCK DATA
const sellerStats = [
  { title: 'Total Revenue', value: '$12,845', change: '+12.5%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'green' },
  { title: 'Active Listings', value: '23',     change: '+3',     changeType: 'positive', icon: ShoppingBagIcon,   color: 'blue'  },
  { title: 'Total Views',    value: '1,247',  change: '+18.2%', changeType: 'positive', icon: EyeIcon,           color: 'purple'},
  { title: 'Success Rate',   value: '94%',    change: '+2.1%',  changeType: 'positive', icon: TrophyIcon,        color: 'orange'}
]
const buyerStats = [
  { title: 'Items Won',     value: '18',   change: '+3',     changeType: 'positive', icon: TrophyIcon,        color: 'green' },
  { title: 'Active Bids',   value: '7',    change: '+2',     changeType: 'positive', icon: ClockIcon,        color: 'blue'  },
  { title: 'Watchlist Items', value: '34', change: '+8',     changeType: 'positive', icon: HeartIcon,        color: 'purple'},
  { title: 'Total Spent',   value: '$8,920', change: '+24.3%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'orange'}
]

const sellerActivities = [
  { title: 'Vintage Rolex Datejust', amount: 2550, status: 'sold',    time: '2 hours ago' },
  { title: 'KAWS Companion Figure',  amount:  850, status: 'bidding', time: '5 hours ago' },
  { title: 'Air Jordan 1 Chicago',   amount: 1200, status: 'sold',    time: '1 day ago'   },
  { title: 'Harry Potter 1st Edition', amount: 3500, status: 'bidding', time: '2 days ago'}
]
const buyerActivities = [
  { title: 'Vintage Guitar 1961',   amount: 15500, status: 'won',    time: '3 hours ago' },
  { title: 'Mickey Mantle Card',    amount:  4200, status: 'bidding', time: '6 hours ago' },
  { title: 'Abstract Sculpture',    amount:  2800, status: 'outbid',  time: '1 day ago'   },
  { title: 'Stamp Collection',      amount:  6800, status: 'won',     time: '3 days ago'  }
]

// ─────────────────────────────────────────
// 5.  DASHBOARD CONTENT
function DashboardContent() {
  const { currentRole, user } = useUserRole()
  const isSeller   = currentRole === 'seller'
  const stats      = isSeller ? sellerStats      : buyerStats
  const activities = isSeller ? sellerActivities : buyerActivities

  return (
    <main className="flex-1 p-8 bg-[#09090B] min-h-screen">
      {/* greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-400">
          Here&apos;s what&apos;s happening with your {currentRole} account today.
        </p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => <StatsCard key={i} {...s} />)}
      </div>

      {/* chart + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <PerformanceChart role={currentRole} />
        </div>
        <QuickActions role={currentRole} />
      </div>

      {/* recent activity + tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={activities} type={currentRole} />
        <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
          <h3 className="text-xl font-bold mb-6">{isSeller ? 'Seller Insights' : 'Bidding Tips'}</h3>
          {isSeller ? (
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                🎯 Your vintage watches category has the highest conversion rate (94%).
              </li>
              <li className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                📈 Sports memorabilia is trending—consider listing similar items.
              </li>
              <li className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                💡 Add more detailed photos to boost bidding by ~25%.
              </li>
            </ul>
          ) : (
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                ⚡ Set up proxy bidding to automate your bids.
              </li>
              <li className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                🎯 Bid in the last few minutes for better win-rates.
              </li>
              <li className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                📱 Enable push notifications so you never miss a bid.
              </li>
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────
// 6.  PAGE COMPONENT + DEBUG OUTPUT
export default function DashboardPage() {
  // quick sanity check (shows up in build logs)
  console.log('Dashboard page components →', {
    Sidebar,
    StatsCard,
    RecentActivity,
    QuickActions,
    PerformanceChart
  })

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar />         
      <DashboardContent />
    </div>
  )
}



 