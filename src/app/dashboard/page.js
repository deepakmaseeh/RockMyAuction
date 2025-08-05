'use client'

import { useUserRole } from '../../contexts/RoleContext'
import Sidebar from '../../components/Sidebar'
import StatsCard from '../../components/dashboard/StatsCard'
import RecentActivity from '../../components/dashboard/RecentActivity'
import QuickActions from '../../components/dashboard/QuickActions'
import PerformanceChart from '../../components/dashboard/PerformanceChart'
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  EyeIcon,
  TrophyIcon,
  HeartIcon,
  ClockIcon
} from '@heroicons/react/24/solid'

// Mock data
const sellerStats = [
  { title: 'Total Revenue', value: '$12,845', change: '+12.5%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'green' },
  { title: 'Active Listings', value: '23', change: '+3', changeType: 'positive', icon: ShoppingBagIcon, color: 'blue' },
  { title: 'Total Views', value: '1,247', change: '+18.2%', changeType: 'positive', icon: EyeIcon, color: 'purple' },
  { title: 'Success Rate', value: '94%', change: '+2.1%', changeType: 'positive', icon: TrophyIcon, color: 'orange' }
]

const buyerStats = [
  { title: 'Items Won', value: '18', change: '+3', changeType: 'positive', icon: TrophyIcon, color: 'green' },
  { title: 'Active Bids', value: '7', change: '+2', changeType: 'positive', icon: ClockIcon, color: 'blue' },
  { title: 'Watchlist Items', value: '34', change: '+8', changeType: 'positive', icon: HeartIcon, color: 'purple' },
  { title: 'Total Spent', value: '$8,920', change: '+24.3%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'orange' }
]

const sellerActivities = [
  { title: 'Vintage Rolex Datejust', amount: 2550, status: 'sold', time: '2 hours ago', image: '/auctions/watch1.jpg' },
  { title: 'KAWS Companion Figure', amount: 850, status: 'bidding', time: '5 hours ago', image: '/auctions/kaws.jpg' },
  { title: 'Air Jordan 1 Chicago', amount: 1200, status: 'sold', time: '1 day ago', image: '/auctions/jordan.jpg' },
  { title: 'Harry Potter First Edition', amount: 3500, status: 'bidding', time: '2 days ago', image: '/auctions/book.jpg' }
]

const buyerActivities = [
  { title: 'Vintage Guitar 1961', amount: 15500, status: 'won', time: '3 hours ago', image: '/auctions/guitar.jpg' },
  { title: 'Baseball Card Mickey Mantle', amount: 4200, status: 'bidding', time: '6 hours ago', image: '/auctions/baseball.jpg' },
  { title: 'Abstract Sculpture', amount: 2800, status: 'outbid', time: '1 day ago', image: '/auctions/sculpture.jpg' },
  { title: 'Vintage Stamp Collection', amount: 6800, status: 'won', time: '3 days ago', image: '/auctions/stamp.jpg' }
]

function DashboardContent() {
  const { currentRole, user } = useUserRole()
  const isSeller = currentRole === 'seller'
  
  const stats = isSeller ? sellerStats : buyerStats
  const activities = isSeller ? sellerActivities : buyerActivities

  return (
    <main className="flex-1 p-8 bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-400">
          Here&apos;s what&apos;s happening with your {currentRole} account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PerformanceChart role={currentRole} />
        </div>

        {/* Quick Actions */}
        <QuickActions role={currentRole} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={activities} type={currentRole} />
        
        {/* Additional Info Panel */}
        <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
          <h3 className="text-xl font-bold mb-6">
            {isSeller ? 'Seller Insights' : 'Bidding Tips'}
          </h3>
          
          {isSeller ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">🎯 Top Performance</h4>
                <p className="text-gray-300 text-sm">Your vintage watches category has the highest conversion rate at 94%!</p>
              </div>
              <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">📈 Trending</h4>
                <p className="text-gray-300 text-sm">Sports memorabilia is trending. Consider listing similar items.</p>
              </div>
              <div className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                <h4 className="font-semibold text-orange-400 mb-2">💡 Tip</h4>
                <p className="text-gray-300 text-sm">Add more detailed photos to increase bidding activity by 25%.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">⚡ Quick Tip</h4>
                <p className="text-gray-300 text-sm">Set up proxy bidding to automatically bid up to your maximum amount.</p>
              </div>
              <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">🎯 Strategy</h4>
                <p className="text-gray-300 text-sm">Bid in the last few minutes for better chances of winning.</p>
              </div>
              <div className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                <h4 className="font-semibold text-purple-400 mb-2">📱 Mobile</h4>
                <p className="text-gray-300 text-sm">Enable push notifications to never miss a bid opportunity.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar />
      <DashboardContent />
    </div>
  )
}
