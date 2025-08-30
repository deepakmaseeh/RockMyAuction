

import Image from 'next/image'
import Link from 'next/link'
import WishlistButton from './WishlistButton'

export default function AuctionCard({ 
  images, 
  imageUrl,
  title, 
  currentBid, 
  endTime, 
  users, 
  slug, 
  type, 
  auction, // ✅ Add full auction object
  auctionId,
  onClick 
}) {
  return (
    <div className={`bg-[#18181B] rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transform transition ${type === 'ended' ? 'opacity-70' : ''}`}>
      <div className="relative w-full h-48">
        <Image
          src={auction?.imageUrl || imageUrl || images?.[0] || '/placeholder-auction.jpg'}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* ✅ Pass full auction object to WishlistButton */}
        {(auction || auctionId) && (
          <div className="absolute top-2 right-2">
            <WishlistButton 
              auction={auction} 
              auctionId={auctionId}
              size="sm" 
            />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            type === 'ended' ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {type === 'ended' ? 'ENDED' : 'LIVE'}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3">
          Current Bid: <span className="text-orange-400 font-bold">${currentBid?.toLocaleString()}</span>
        </p>
        <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
          <span>{users} bidder{users !== 1 ? 's' : ''}</span>
          <span>Ends: {endTime}</span>
        </div>
        
        <div onClick={onClick} className="cursor-pointer">
          <button className={`w-full py-2 rounded-lg font-semibold ${type === 'ended'
            ? 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            : 'bg-orange-500 hover:bg-orange-600 text-white'} transition-colors`}>
            {type === 'ended' ? 'View Details' : 'Place Bid'}
          </button>
        </div>
      </div>
    </div>
  )
}
