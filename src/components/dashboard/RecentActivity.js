export default function RecentActivity({ activities, type }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <h3 className="text-xl font-bold mb-6">Recent {type === 'seller' ? 'Sales' : 'Bids'}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-[#232326] last:border-b-0">
            <div className="flex items-center gap-3">
              <img
                src={activity.image || '/placeholder-auction.jpg'}
                alt={activity.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium text-white text-sm">{activity.title}</h4>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">${activity.amount.toLocaleString()}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                activity.status === 'won' ? 'bg-green-600 text-green-100' :
                activity.status === 'sold' ? 'bg-blue-600 text-blue-100' :
                activity.status === 'bidding' ? 'bg-orange-600 text-orange-100' :
                'bg-gray-600 text-gray-100'
              }`}>
                {activity.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition">
        View All {type === 'seller' ? 'Sales' : 'Bids'} →
      </button>
    </div>
  )
}

