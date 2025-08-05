'use client'

import { useState } from 'react'

export default function PerformanceChart({ role, data }) {
  const [timeframe, setTimeframe] = useState('7d')

  const chartData = {
    '7d': [120, 150, 180, 220, 190, 240, 280],
    '30d': [1200, 1350, 1180, 1420, 1590, 1340, 1680, 1520, 1890, 2100, 2240, 2180, 2350, 2420, 2280, 2590, 2840, 2720, 2980, 3120, 3240, 3180, 3350, 3420, 3280, 3590, 3840, 3720, 3980, 4120],
    '90d': [3000, 3200, 3100, 3400, 3600, 3500, 3800, 3700, 4000, 4200, 4100, 4400]
  }

  const currentData = chartData[timeframe]
  const maxValue = Math.max(...currentData)

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">
          {role === 'seller' ? 'Sales' : 'Bidding'} Performance
        </h3>
        <div className="flex bg-[#232326] rounded-lg p-1">
          {['7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded text-sm transition ${
                timeframe === period
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            ${currentData[currentData.length - 1]?.toLocaleString()}
          </span>
          <span className="text-green-400 text-sm">+12.5%</span>
        </div>

        {/* Simple SVG Chart */}
        <div className="h-32 relative">
          <svg className="w-full h-full" viewBox="0 0 400 100">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Chart Line */}
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              points={currentData.map((value, index) => 
                `${(index / (currentData.length - 1)) * 380 + 10},${90 - (value / maxValue) * 70}`
              ).join(' ')}
            />
            
            {/* Fill Area */}
            <polygon
              fill="url(#gradient)"
              points={`10,90 ${currentData.map((value, index) => 
                `${(index / (currentData.length - 1)) * 380 + 10},${90 - (value / maxValue) * 70}`
              ).join(' ')} 390,90`}
            />
          </svg>
        </div>

        <div className="text-sm text-gray-400">
          {role === 'seller' ? 'Total Revenue' : 'Total Bids Placed'} - Last {timeframe}
        </div>
      </div>
    </div>
  )
}
