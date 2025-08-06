import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/solid'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  )
}

export default function StatsCard({ title, value, change, changeType, icon: Icon, color = 'orange', loading }) {
  if (loading) {
    return (
      <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] animate-pulse">
        <div className="h-6 w-6 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 w-24 bg-gray-700 rounded"></div>
      </div>
    )
  }

  const isPositive = changeType === 'positive'
  
  const colorClasses = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  }

  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] hover:border-orange-500/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}/20`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUpIcon className="h-4 w-4" />
            ) : (
              <TrendingDownIcon className="h-4 w-4" />
            )}
            {change}
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
