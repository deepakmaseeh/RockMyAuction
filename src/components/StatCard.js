export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  subtitle 
}) {
  const changeColor = changeType === 'positive' ? 'text-green-400' : 'text-red-400'
  const changeIcon = changeType === 'positive' ? '↗' : '↘'
  
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] hover:border-orange-500/20 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <span className="text-2xl">{icon}</span>
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
            <span>{changeIcon}</span>
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
