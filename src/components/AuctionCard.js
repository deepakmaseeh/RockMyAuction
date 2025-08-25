import Image from 'next/image'
import Link from 'next/link'

export default function AuctionCard({ images, title, currentBid, endTime, users, slug, type }) {
  return (
    <div className={`bg-[#18181B] rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transform transition ${type === 'ended' ? 'opacity-70' : ''}`}>
      <div className="relative w-full h-48">
        <Image
          src={images?.[0] || '/placeholder-auction.jpg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3">
          Current Bid: <span className="text-orange-400 font-bold">${currentBid.toLocaleString()}</span>
        </p>
        <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
          <span>{users} bidder{users !== 1 ? 's' : ''}</span>
          <span>Ends: {endTime}</span>
        </div>
        <Link href={`/auctions/${slug}`}>
          <button className={`w-full py-2 rounded-lg font-semibold ${type === 'ended'
            ? 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            : 'bg-orange-500 hover:bg-orange-600 text-white'} transition-colors`}>
            {type === 'ended' ? 'View Details' : 'Place Bid'}
          </button>
        </Link>
      </div>
    </div>
  )
}
