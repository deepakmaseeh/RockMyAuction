export default function RecentActivity({ activities = [], type }) {
  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
        Recent {type === 'seller' ? 'Sales' : 'Bids'}
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">
              {type === 'seller' ? '💰' : '🏷️'}
            </div>
            <p className="text-gray-400 text-sm">
              No {type === 'seller' ? 'sales' : 'bids'} yet
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-3 border-b border-[#232326] last:border-b-0 hover:bg-[#232326]/30 transition-colors rounded-lg px-2 sm:px-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={activity.image || '/placeholder-auction.jpg'}
                    alt={activity.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    loading="lazy"
                  />
                  {/* Status indicator overlay for mobile */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full sm:hidden ${
                    activity.status === 'won' ? 'bg-green-500' :
                    activity.status === 'sold' ? 'bg-blue-500' :
                    activity.status === 'bidding' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base truncate">
                    {activity.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs sm:text-sm text-gray-400">
                      {activity.time}
                    </p>
                    {/* Mobile status badge */}
                    <div className={`sm:hidden text-xs px-2 py-0.5 rounded-full ${
                      activity.status === 'won' ? 'bg-green-600/20 text-green-300' :
                      activity.status === 'sold' ? 'bg-blue-600/20 text-blue-300' :
                      activity.status === 'bidding' ? 'bg-orange-600/20 text-orange-300' :
                      'bg-gray-600/20 text-gray-300'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-3">
                <div className="font-semibold text-white text-sm sm:text-base">
                  ${activity.amount?.toLocaleString() || '0'}
                </div>
                {/* Desktop status badge */}
                <div className={`hidden sm:block text-xs px-2 py-1 rounded-full mt-1 ${
                  activity.status === 'won' ? 'bg-green-600 text-green-100' :
                  activity.status === 'sold' ? 'bg-blue-600 text-blue-100' :
                  activity.status === 'bidding' ? 'bg-orange-600 text-orange-100' :
                  'bg-gray-600 text-gray-100'
                }`}>
                  {activity.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > 0 && (
        <button className="w-full mt-4 sm:mt-6 py-2 sm:py-3 text-orange-400 hover:text-orange-300 active:text-orange-500 text-sm sm:text-base font-medium transition-colors touch-manipulation border border-orange-400/20 hover:border-orange-400/40 rounded-lg hover:bg-orange-400/5">
          View All {type === 'seller' ? 'Sales' : 'Bids'} →
        </button>
      )}
    </div>
  )
}
