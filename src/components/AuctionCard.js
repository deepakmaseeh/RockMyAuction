import Link from 'next/link'

export default function AuctionCard({ image, title, currentBid, endTime, users, slug }) {
  return (
    <div className="bg-[#232326] rounded-2xl shadow p-4 flex flex-col">
      <img src={image} alt={title} className="rounded-xl w-full h-40 object-cover mb-3" />
      <div className="text-lg font-semibold text-white mb-1">{title}</div>
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 mb-1">
        <span>Current Bid: <span className="text-orange-400 font-bold">${currentBid.toLocaleString()}</span></span>
        <span>{users} users</span>
      </div>
      <div className="mt-1 text-xs text-gray-400">Ends: {endTime}</div>
      <Link href={`/auctions/${slug}`}>
        <button className="mt-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full">
          Place Bid
        </button>
      </Link>
    </div>
  )
}
