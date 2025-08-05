'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')

  // Mock admin data
  const [adminStats] = useState({
    totalUsers: 12847,
    activeUsers: 8943,
    totalAuctions: 3456,
    liveAuctions: 234,
    totalRevenue: 2840000,
    monthlyRevenue: 340000,
    averageOrderValue: 850,
    conversionRate: 3.2
  })

  const [recentUsers] = useState([
    { id: 1, name: 'Alex Thompson', email: 'alex@example.com', joined: '2024-01-15', status: 'active', sales: 12, purchases: 8 },
    { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', joined: '2024-01-14', status: 'active', sales: 5, purchases: 23 },
    { id: 3, name: 'Mike Rodriguez', email: 'mike@example.com', joined: '2024-01-13', status: 'pending', sales: 0, purchases: 2 },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', joined: '2024-01-12', status: 'suspended', sales: 45, purchases: 12 }
  ])

  const [recentAuctions] = useState([
    { id: 1, title: 'Vintage Rolex Datejust', seller: 'LuxuryTimepieces', currentBid: 2550, bids: 45, status: 'live', reported: false },
    { id: 2, title: 'KAWS Companion Figure', seller: 'ArtCollective', currentBid: 850, bids: 22, status: 'live', reported: true },
    { id: 3, title: 'Air Jordan 1 Chicago', seller: 'SneakerVault', currentBid: 1200, bids: 67, status: 'ended', reported: false },
    { id: 4, title: 'First Edition Harry Potter', seller: 'RareBooks', currentBid: 3500, bids: 38, status: 'live', reported: false }
  ])

  const [systemHealth] = useState({
    serverStatus: 'healthy',
    uptime: '99.9%',
    responseTime: '145ms',
    errorRate: '0.02%'
  })

  const handleUserAction = (userId, action) => {
    alert(`${action} user ${userId} - This would trigger the actual API call`)
  }

  const handleAuctionAction = (auctionId, action) => {
    alert(`${action} auction ${auctionId} - This would trigger the actual API call`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'live':
      case 'healthy':
        return 'bg-green-600 text-green-100'
      case 'pending':
        return 'bg-yellow-600 text-yellow-100'
      case 'suspended':
      case 'ended':
        return 'bg-red-600 text-red-100'
      default:
        return 'bg-gray-600 text-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
                <span>🏺</span>
                Rock the Auction
              </Link>
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">ADMIN</span>
            </div>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your auction platform</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-[#18181B] rounded-lg p-1 border border-[#232326]">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded text-sm transition ${
                  timeRange === range
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">👥</div>
              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">+12%</span>
            </div>
            <div className="text-2xl font-bold text-white">{adminStats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
          
          <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🔥</div>
              <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Live</span>
            </div>
            <div className="text-2xl font-bold text-white">{adminStats.liveAuctions}</div>
            <div className="text-sm text-gray-400">Live Auctions</div>
          </div>
          
          <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💰</div>
              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">+8%</span>
            </div>
            <div className="text-2xl font-bold text-white">${(adminStats.totalRevenue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          
          <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📈</div>
              <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-1 rounded">{adminStats.conversionRate}%</span>
            </div>
            <div className="text-2xl font-bold text-white">${adminStats.averageOrderValue}</div>
            <div className="text-sm text-gray-400">Avg Order Value</div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="bg-[#18181B] rounded-xl border border-[#232326] mb-8">
          <div className="flex border-b border-[#232326] overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'users', label: 'User Management', icon: '👥' },
              { key: 'auctions', label: 'Auction Management', icon: '🏺' },
              { key: 'reports', label: 'Reports', icon: '📋' },
              { key: 'system', label: 'System Health', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity Chart Placeholder */}
                  <div className="bg-[#232326] rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Platform Activity (Last 30 days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 bg-[#2a2a2e] rounded p-4">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-orange-500 w-2 rounded-t transition-all"
                          style={{ height: `${Math.random() * 200 + 20}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition">
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-medium">View Users</div>
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition">
                        <div className="text-2xl mb-2">🏺</div>
                        <div className="font-medium">Manage Auctions</div>
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="font-medium">Analytics</div>
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition">
                        <div className="text-2xl mb-2">🚨</div>
                        <div className="font-medium">Reported Items</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Recent Users</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="bg-[#232326] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                    />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
                      Search
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#232326]">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Joined</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Activity</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id} className="border-b border-[#232326]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{user.email}</td>
                          <td className="py-3 px-4 text-gray-400">{user.joined}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {user.sales} sold • {user.purchases} bought
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'view')}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Suspend
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Auctions Tab */}
            {activeTab === 'auctions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Recent Auctions</h3>
                  <div className="flex gap-2">
                    <select className="bg-[#232326] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none">
                      <option value="all">All Status</option>
                      <option value="live">Live</option>
                      <option value="ended">Ended</option>
                      <option value="reported">Reported</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentAuctions.map(auction => (
                    <div key={auction.id} className="bg-[#232326] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-white">{auction.title}</h4>
                            {auction.reported && (
                              <span className="bg-red-600 text-red-100 px-2 py-1 rounded-full text-xs font-medium">
                                🚨 Reported
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                              {auction.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            by {auction.seller} • ${auction.currentBid.toLocaleString()} • {auction.bids} bids
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAuctionAction(auction.id, 'view')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleAuctionAction(auction.id, 'remove')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">Platform Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#232326] rounded-lg p-6">
                    <h4 className="font-medium mb-4">Revenue Report</h4>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      ${adminStats.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">This month</div>
                  </div>
                  <div className="bg-[#232326] rounded-lg p-6">
                    <h4 className="font-medium mb-4">User Growth</h4>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      +{Math.floor(adminStats.totalUsers * 0.12).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">New users this month</div>
                  </div>
                </div>
              </div>
            )}

            {/* System Health Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#232326] rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="font-medium">Server Status</div>
                    <div className="text-sm text-green-400">Healthy</div>
                  </div>
                  <div className="bg-[#232326] rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="font-medium">Uptime</div>
                    <div className="text-sm text-green-400">{systemHealth.uptime}</div>
                  </div>
                  <div className="bg-[#232326] rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-medium">Response Time</div>
                    <div className="text-sm text-orange-400">{systemHealth.responseTime}</div>
                  </div>
                  <div className="bg-[#232326] rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">🚨</div>
                    <div className="font-medium">Error Rate</div>
                    <div className="text-sm text-green-400">{systemHealth.errorRate}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
