export default function StatusBadge({ status }) {
  const statusConfig = {
    Live: { bg: 'bg-green-500', text: 'text-white', icon: '🔴' },
    Pending: { bg: 'bg-yellow-500', text: 'text-white', icon: '⏳' },
    Sold: { bg: 'bg-blue-500', text: 'text-white', icon: '✅' },
    Expired: { bg: 'bg-gray-500', text: 'text-white', icon: '⏰' },
    Draft: { bg: 'bg-orange-500', text: 'text-white', icon: '📝' }
  }

  const config = statusConfig[status] || statusConfig.Pending

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
      <span className="text-xs">{config.icon}</span>
      {status}
    </span>
  )
}
