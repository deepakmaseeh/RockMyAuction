import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Link from 'next/link'

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = 'orange',
  loading = false,
  error = false,
  onClick,
  href,
  tooltip
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const isPositive = changeType === 'positive'
  
  const colorClasses = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  }

  const textColorClasses = {
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    red: 'text-red-400'
  }

  // Calculate progress width based on change percentage
  const getProgressWidth = (changeType, change) => {
    if (!change) return '50%'
    
    const numericChange = parseFloat(change.replace(/[^\d.-]/g, ''))
    if (numericChange > 20) return '90%'
    if (numericChange > 10) return '70%'
    if (numericChange > 0) return '60%'
    if (numericChange > -10) return '40%'
    return '20%'
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] animate-pulse">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 rounded-lg bg-gray-700 w-11 h-11 sm:w-12 sm:h-12" />
          <div className="h-4 bg-gray-700 rounded w-12" />
        </div>
        <div className="space-y-2">
          <div className="h-6 sm:h-8 bg-gray-700 rounded w-20" />
          <div className="h-3 sm:h-4 bg-gray-700 rounded w-24" />
        </div>
        <div className="mt-3 sm:hidden">
          <div className="w-full bg-gray-700 rounded-full h-1" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-red-500/20">
        <div className="flex items-center justify-center h-20">
          <div className="text-center">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-xs">Failed to load</p>
          </div>
        </div>
      </div>
    )
  }

  const cardContent = (
    <div 
      className={`bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] hover:border-orange-500/20 transition-all ${
        (onClick || href) ? 'cursor-pointer hover:bg-[#1a1a1f] active:bg-[#1c1c21] touch-manipulation' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]}/20 flex-shrink-0`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${textColorClasses[color]}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <TrendingDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {value}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          {title}
        </p>
      </div>
      
      {/* Mobile progress indicator for visual enhancement */}
      <div className="mt-3 sm:hidden">
        <div className="w-full bg-gray-700/50 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-1 rounded-full ${colorClasses[color]} transition-all duration-500 ease-out`}
            style={{ width: getProgressWidth(changeType, change) }}
          />
        </div>
      </div>

      {/* Click indicator for interactive cards */}
      {(onClick || href) && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  )

  const wrappedContent = (
    <div 
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {cardContent}
      
      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-lg">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  )

  // Handle different interaction types
  if (href) {
    return <Link href={href}>{wrappedContent}</Link>
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left touch-manipulation">
        {wrappedContent}
      </button>
    )
  }

  return wrappedContent
}
