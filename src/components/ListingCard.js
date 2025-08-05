import StatusBadge from './StatusBadge'
import Link from 'next/link'

export default function ListingCard({ item }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-4 border border-[#232326] hover:border-orange-500/20 transition group">
      {/* Image */}
      <div className="relative mb-3">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-48 object-cover rounded-lg" 
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={item.status} />
        </div>
        {item.isHot && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            🔥 HOT
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-white group-hover:text-orange-400 transition">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Current Bid</span>
          <span className="text-orange-400 font-bold">${item.currentBid}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{item.bids} Bids</span>
          <span className="text-gray-400">{item.timeLeft}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link 
            href={`/auctions/${item.id}`}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-center text-sm font-medium transition"
          >
            View Details
          </Link>
          <button className="px-3 py-2 bg-[#232326] hover:bg-[#2a2a2e] text-gray-300 rounded text-sm transition">
            📊
          </button>
        </div>
      </div>
    </div>
  )
}
