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
  const minValue = Math.min(...currentData)
  const currentValue = currentData[currentData.length - 1]
  const previousValue = currentData[currentData.length - 2]
  const percentChange = previousValue ? ((currentValue - previousValue) / previousValue * 100).toFixed(1) : 0

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-bold">
          {role === 'seller' ? 'Sales' : 'Bidding'} Performance
        </h3>
        <div className="flex bg-[#232326] rounded-lg p-1 self-start sm:self-auto">
          {['7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition touch-manipulation ${
                timeframe === period
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white active:bg-[#2a2a2e]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            ${currentValue?.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <span className={`text-sm ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange}%
            </span>
            <span className="text-xs text-gray-500">vs previous</span>
          </div>
        </div>

        {/* Mobile-optimized SVG Chart */}
        <div className="h-24 sm:h-32 relative bg-[#232326]/30 rounded-lg overflow-hidden">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${role}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
              {/* Glow effect for the line */}
              <filter id={`glow-${role}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid lines for better readability */}
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Fill Area */}
            <polygon
              fill={`url(#gradient-${role})`}
              points={`10,90 ${currentData.map((value, index) => {
                const x = (index / (currentData.length - 1)) * 380 + 10
                const y = 90 - ((value - minValue) / (maxValue - minValue)) * 70
                return `${x},${y}`
              }).join(' ')} 390,90`}
            />
            
            {/* Chart Line with glow */}
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${role})`}
              points={currentData.map((value, index) => {
                const x = (index / (currentData.length - 1)) * 380 + 10
                const y = 90 - ((value - minValue) / (maxValue - minValue)) * 70
                return `${x},${y}`
              }).join(' ')}
            />
            
            {/* Data points for mobile interaction */}
            {currentData.map((value, index) => {
              const x = (index / (currentData.length - 1)) * 380 + 10
              const y = 90 - ((value - minValue) / (maxValue - minValue)) * 70
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#f97316"
                  stroke="#fff"
                  strokeWidth="2"
                  className="opacity-0 sm:opacity-100 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>${value.toLocaleString()}</title>
                </circle>
              )
            })}
          </svg>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 sm:pt-3 border-t border-[#232326]">
          <div className="text-center sm:text-left">
            <div className="text-xs text-gray-400 mb-1">Current</div>
            <div className="text-sm sm:text-base font-semibold text-white">
              ${currentValue?.toLocaleString()}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs text-gray-400 mb-1">Peak</div>
            <div className="text-sm sm:text-base font-semibold text-green-400">
              ${maxValue?.toLocaleString()}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
            <div className="text-xs text-gray-400 mb-1">
              {role === 'seller' ? 'Total Revenue' : 'Total Bids Placed'}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">
              Last {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : '90 days'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
