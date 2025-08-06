'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import Navbar from '@/components/Navbar'

// Simple Chart Component (using CSS for bars)
function BarChart({ data, title }) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-16 text-sm text-gray-400">{item.label}</div>
            <div className="flex-1 bg-[#232326] rounded-full h-8 relative">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="text-white text-xs font-medium">${item.value.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Line Chart Component (using CSS)
function LineChart({ data, title }) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between gap-2 bg-[#232326] rounded-lg p-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
              <div 
                className="bg-orange-500 w-8 rounded-t transition-all duration-500"
                style={{ height: `${(item.value / maxValue) * 180}px` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Analytics Cards Component
function AnalyticsCard({ title, value, change, changeType, icon }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {change && (
          <span className={`text-sm px-2 py-1 rounded ${
            changeType === 'positive' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
          }`}>
            {changeType === 'positive' ? '↗' : '↘'} {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}

export default function SellerAnalyticsPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [timeRange, setTimeRange] = useState('30d')

  // Mock analytics data
  const analyticsData = {
    cards: [
      { title: 'Total Revenue', value: '$12,845', change: '+12.5%', changeType: 'positive', icon: '💰' },
      { title: 'Active Listings', value: '23', change: '+3', changeType: 'positive', icon: '📦' },
      { title: 'Total Views', value: '1,247', change: '+18.2%', changeType: 'positive', icon: '👁️' },
      { title: 'Conversion Rate', value: '3.2%', change: '+0.5%', changeType: 'positive', icon: '📈' }
    ],
    monthlyRevenue: [
      { label: 'Jan', value: 1200 },
      { label: 'Feb', value: 1850 },
      { label: 'Mar', value: 2100 },
      { label: 'Apr', value: 1950 },
      { label: 'May', value: 2400 },
      { label: 'Jun', value: 2100 }
    ],
    categoryPerformance: [
      { label: 'Electronics', value: 4200 },
      { label: 'Art', value: 3100 },
      { label: 'Watches', value: 2800 },
      { label: 'Books', value: 1900 },
      { label: 'Collectibles', value: 945 }
    ]
  }

  const topPerformingItems = [
    { name: 'Vintage Rolex Datejust', revenue: '$2,550', views: 342, bids: 45 },
    { name: 'KAWS Companion Figure', revenue: '$850', views: 156, bids: 22 },
    { name: 'Air Jordan 1 Chicago', revenue: '$1,200', views: 289, bids: 67 }
  ]

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Use Navbar Component */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sales Analytics</h1>
            <p className="text-gray-400 text-sm sm:text-base">Track your performance and optimize your selling strategy</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-[#18181B] rounded-lg p-1 border border-[#232326] self-start sm:self-auto">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 sm:px-4 py-2 rounded text-sm transition ${
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

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {analyticsData.cards.map((card, index) => (
            <AnalyticsCard key={index} {...card} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <LineChart data={analyticsData.monthlyRevenue} title="Monthly Revenue Trend" />
          <BarChart data={analyticsData.categoryPerformance} title="Revenue by Category" />
        </div>

        {/* Top Performing Items and Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Top Performing Items */}
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <h3 className="text-lg font-bold mb-4">Top Performing Items</h3>
            <div className="space-y-3 sm:space-y-4">
              {topPerformingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-[#232326] rounded-lg">
                  <div className="min-w-0 flex-1 pr-4">
                    <h4 className="font-medium text-white text-sm sm:text-base truncate">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400">{item.views} views • {item.bids} bids</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-400 text-sm sm:text-base">{item.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <h3 className="text-lg font-bold mb-4">📊 Quick Insights</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2 text-sm sm:text-base">🎯 Best Performance</h4>
                <p className="text-gray-300 text-xs sm:text-sm">Electronics category shows 24% higher conversion rate</p>
              </div>
              <div className="p-3 sm:p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2 text-sm sm:text-base">📈 Growth Trend</h4>
                <p className="text-gray-300 text-xs sm:text-sm">Revenue increased by 18% compared to last month</p>
              </div>
              <div className="p-3 sm:p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                <h4 className="font-semibold text-orange-400 mb-2 text-sm sm:text-base">💡 Recommendation</h4>
                <p className="text-gray-300 text-xs sm:text-sm">Consider listing more items in Electronics category</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
