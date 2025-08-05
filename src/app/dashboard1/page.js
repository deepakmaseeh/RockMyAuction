'use client'
import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import ListingCard from '../../components/ListingCard'

const dashboardStats = [
  {
    title: 'Total Revenue',
    value: '$45,280',
    change: '+12.3%',
    changeType: 'positive',
    icon: '💰',
    subtitle: 'This month'
  },
  {
    title: 'Active Listings',
    value: '24',
    change: '+3',
    changeType: 'positive',
    icon: '📦',
    subtitle: 'Currently live'
  },
  {
    title: 'Total Sales',
    value: '156',
    change: '+8.1%',
    changeType: 'positive',
    icon: '🎯',
    subtitle: 'All time'
  },
  {
    title: 'Success Rate',
    value: '89.2%',
    change: '-2.1%',
    changeType: 'negative',
    icon: '📈',
    subtitle: 'Last 30 days'
  }
]

const recentListings = [
  {
    id: 1,
    image: '/auction1.jpg',
    title: 'Vintage Rolex Submariner 1960s',
    currentBid: '12,500',
    bids: 23,
    timeLeft: '2h 15m',
    status: 'Live',
    isHot: true
  },
  {
    id: 2,
    image: '/auction2.jpg',
    title: 'Rare Pokemon Card Collection',
    currentBid: '8,750',
    bids: 45,
    timeLeft: '5h 32m',
    status: 'Live',
    isHot: false
  },
  {
    id: 3,
    image: '/auction3.jpg',
    title: 'Antique Ming Dynasty Vase',
    currentBid: '25,000',
    bids: 12,
    timeLeft: '1d 4h',
    status: 'Live',
    isHot: true
  },
  {
    id: 4,
    image: '/auction4.jpg',
    title: 'Classic Gibson Les Paul 1959',
    currentBid: '15,200',
    bids: 18,
    timeLeft: '3h 45m',
    status: 'Live',
    isHot: false
  },
  {
    id: 5,
    image: '/auction5.jpg',
    title: 'Original Banksy Street Art',
    currentBid: '45,000',
    bids: 67,
    timeLeft: '6h 22m',
    status: 'Live',
    isHot: true
  },
  {
    id: 6,
    image: '/auction6.jpg',
    title: 'Hermès Birkin Bag Limited Edition',
    currentBid: '18,900',
    bids: 34,
    timeLeft: '2d 1h',
    status: 'Live',
    isHot: false
  }
]

export default function Dashboard() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your auctions.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-[#18181B] border border-[#232326] text-gray-300 px-4 py-2 rounded-lg hover:border-orange-500/20 transition">
              📅 Last 30 days
            </button>
            <Link 
              href="/seller/new-auction"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
            >
              ➕ Add New Item
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/seller/new-auction"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition flex items-center gap-3"
            >
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold">List New Item</div>
                <div className="text-sm opacity-90">Start a new auction</div>
              </div>
            </Link>
            
            <Link 
              href="/wallet"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-3"
            >
              <span className="text-2xl">💳</span>
              <div>
                <div className="font-semibold">Manage Wallet</div>
                <div className="text-sm opacity-90">View earnings & payouts</div>
              </div>
            </Link>
            
            <Link 
              href="/seller/analytics"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-3"
            >
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold">View Analytics</div>
                <div className="text-sm opacity-90">Track performance</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Your Active Listings</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-[#232326] text-gray-400'}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-[#232326] text-gray-400'}`}
              >
                ☰
              </button>
              <Link 
                href="/seller/active-auctions"
                className="text-orange-400 hover:text-orange-300 text-sm font-medium ml-4"
              >
                View All →
              </Link>
            </div>
          </div>
          
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {recentListings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
