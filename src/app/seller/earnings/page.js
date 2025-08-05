'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

// Mock earnings data
const mockEarnings = {
  totalEarnings: 152340,
  currentBalance: 8450,
  monthlyEarnings: 12500,
  pendingBalance: 3500,
  platformFees: 1840,
  netEarnings: 10660,
  recentTransactions: [
    { 
      id: 1, 
      type: 'sale', 
      item: 'Vintage Rolex Datejust', 
      amount: 2550, 
      fees: 255, 
      net: 2295,
      date: '2024-01-18', 
      status: 'completed',
      buyer: 'Sarah Johnson'
    },
    { 
      id: 2, 
      type: 'payout', 
      item: 'Monthly Payout', 
      amount: -12000, 
      fees: 0, 
      net: -12000,
      date: '2024-01-15', 
      status: 'completed',
      method: 'PayPal'
    },
    { 
      id: 3, 
      type: 'sale', 
      item: 'KAWS Companion Figure', 
      amount: 850, 
      fees: 85, 
      net: 765,
      date: '2024-01-12', 
      status: 'pending',
      buyer: 'Mike Chen'
    },
    { 
      id: 4, 
      type: 'sale', 
      item: 'Air Jordan 1 Chicago', 
      amount: 1200, 
      fees: 120, 
      net: 1080,
      date: '2024-01-10', 
      status: 'completed',
      buyer: 'Emma Wilson'
    }
  ],
  monthlyChart: [
    { month: 'Jul', earnings: 8500, sales: 12 },
    { month: 'Aug', earnings: 12300, sales: 18 },
    { month: 'Sep', earnings: 15600, sales: 22 },
    { month: 'Oct', earnings: 11200, sales: 16 },
    { month: 'Nov', earnings: 14800, sales: 21 },
    { month: 'Dec', earnings: 13400, sales: 19 },
    { month: 'Jan', earnings: 12500, sales: 17 }
  ],
  payoutMethods: [
    { id: 1, type: 'PayPal', email: 'seller@example.com', isDefault: true, verified: true },
    { id: 2, type: 'Bank Transfer', account: '****1234', isDefault: false, verified: true }
  ]
}

// Earnings Card Component
function EarningsCard({ title, amount, change, changeType, icon, color = 'orange' }) {
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
        <h3 className="text-2xl font-bold text-white">${amount.toLocaleString()}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}

// Transaction Item Component
function TransactionItem({ transaction }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'sale': return '💰'
      case 'payout': return '📤'
      default: return '📊'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-green-100'
      case 'pending': return 'bg-yellow-600 text-yellow-100'
      case 'failed': return 'bg-red-600 text-red-100'
      default: return 'bg-gray-600 text-gray-100'
    }
  }

  const isNegative = transaction.amount < 0

  return (
    <div className="flex items-center justify-between p-4 bg-[#232326] rounded-lg hover:bg-[#2a2a2e] transition">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
        <div>
          <h4 className="font-medium text-white">{transaction.item}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
          {isNegative ? '' : '+'}{transaction.net > 0 ? `$${transaction.net.toLocaleString()}` : `$${Math.abs(transaction.amount).toLocaleString()}`}
        </div>
        {transaction.type === 'sale' && (
          <div className="text-xs text-gray-400">
            Gross: ${transaction.amount.toLocaleString()} • Fee: ${transaction.fees}
          </div>
        )}
      </div>
    </div>
  )
}

// Earnings Chart Component
function EarningsChart({ data }) {
  const maxEarnings = Math.max(...data.map(d => d.earnings))

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Monthly Earnings Trend</h3>
        <div className="text-sm text-gray-400">Last 7 months</div>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full flex items-end justify-center" style={{ height: '220px' }}>
              <div 
                className="bg-orange-500 w-full max-w-[40px] rounded-t transition-all duration-500 hover:bg-orange-400 cursor-pointer"
                style={{ height: `${(item.earnings / maxEarnings) * 200}px` }}
                title={`${item.month}: $${item.earnings.toLocaleString()}`}
              />
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              <div>{item.month}</div>
              <div className="font-medium text-white">${(item.earnings / 1000).toFixed(1)}k</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Payout Methods Component
function PayoutMethods({ methods, onAddMethod }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Payout Methods</h3>
        <button 
          onClick={onAddMethod}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Method
        </button>
      </div>
      
      <div className="space-y-3">
        {methods.map(method => (
          <div key={method.id} className="flex items-center justify-between p-4 bg-[#232326] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {method.type === 'PayPal' ? '💳' : '🏦'}
              </div>
              <div>
                <div className="font-medium text-white">{method.type}</div>
                <div className="text-sm text-gray-400">
                  {method.email || method.account}
                </div>
              </div>
              {method.verified && (
                <span className="bg-green-600 text-green-100 px-2 py-1 rounded-full text-xs">
                  ✓ Verified
                </span>
              )}
              {method.isDefault && (
                <span className="bg-orange-600 text-orange-100 px-2 py-1 rounded-full text-xs">
                  Default
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-white text-sm">Edit</button>
              <button className="text-gray-400 hover:text-red-400 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Earnings Page
export default function EarningsPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedTab, setSelectedTab] = useState('overview')

  const handleRequestPayout = () => {
    if (mockEarnings.currentBalance < 50) {
      alert('Minimum payout amount is $50')
      return
    }
    alert(`Payout request of $${mockEarnings.currentBalance.toLocaleString()} has been submitted!`)
  }

  const handleAddPayoutMethod = () => {
    alert('Add payout method feature would open a form here')
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <img src="/RMA-Logo.png" alt="Rock My Auction" className="h-12" />
            </Link>
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
            <h1 className="text-3xl font-bold mb-2">Earnings Dashboard</h1>
            <p className="text-gray-400">Track your sales performance and manage payouts</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleRequestPayout}
              disabled={mockEarnings.currentBalance < 50}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Request Payout (${mockEarnings.currentBalance.toLocaleString()})
            </button>
          </div>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EarningsCard 
            title="Total Earnings" 
            amount={mockEarnings.totalEarnings} 
            change="+18.2%" 
            changeType="positive"
            icon="💰"
            color="green"
          />
          <EarningsCard 
            title="Current Balance" 
            amount={mockEarnings.currentBalance} 
            change="+$2,450" 
            changeType="positive"
            icon="💳"
            color="blue"
          />
          <EarningsCard 
            title="This Month" 
            amount={mockEarnings.monthlyEarnings} 
            change="+12.8%" 
            changeType="positive"
            icon="📅"
            color="purple"
          />
          <EarningsCard 
            title="Platform Fees" 
            amount={mockEarnings.platformFees} 
            change="-5.2%" 
            changeType="positive"
            icon="📊"
            color="orange"
          />
        </div>

        {/* Earnings Chart */}
        <div className="mb-8">
          <EarningsChart data={mockEarnings.monthlyChart} />
        </div>

        {/* Tabs */}
        <div className="bg-[#18181B] rounded-xl border border-[#232326] mb-8">
          <div className="flex border-b border-[#232326]">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'transactions', label: 'Transactions', icon: '💱' },
              { key: 'payouts', label: 'Payout Methods', icon: '💳' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  selectedTab === tab.key
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
            {selectedTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Earnings Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#232326] rounded-lg">
                      <span className="text-gray-300">Gross Earnings</span>
                      <span className="font-bold text-white">${(mockEarnings.monthlyEarnings + mockEarnings.platformFees).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#232326] rounded-lg">
                      <span className="text-gray-300">Platform Fees (10%)</span>
                      <span className="font-bold text-red-400">-${mockEarnings.platformFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                      <span className="text-gray-300">Net Earnings</span>
                      <span className="font-bold text-green-400">${mockEarnings.netEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#232326] rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Average Sale Value</span>
                        <span className="font-bold text-white">$1,470</span>
                      </div>
                      <div className="text-sm text-gray-400">Based on last 30 days</div>
                    </div>
                    <div className="p-4 bg-[#232326] rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Conversion Rate</span>
                        <span className="font-bold text-white">94%</span>
                      </div>
                      <div className="text-sm text-gray-400">Items sold / Items listed</div>
                    </div>
                    <div className="p-4 bg-[#232326] rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Avg. Payout Time</span>
                        <span className="font-bold text-white">2-3 days</span>
                      </div>
                      <div className="text-sm text-gray-400">After sale completion</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {selectedTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Recent Transactions</h3>
                  <select className="bg-[#232326] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none">
                    <option value="all">All Types</option>
                    <option value="sales">Sales Only</option>
                    <option value="payouts">Payouts Only</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  {mockEarnings.recentTransactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
                
                <div className="text-center pt-4">
                  <button className="text-orange-400 hover:text-orange-300 font-medium">
                    View All Transactions →
                  </button>
                </div>
              </div>
            )}

            {/* Payout Methods Tab */}
            {selectedTab === 'payouts' && (
              <PayoutMethods methods={mockEarnings.payoutMethods} onAddMethod={handleAddPayoutMethod} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
