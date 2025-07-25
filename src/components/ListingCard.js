import StatusBadge from './StatusBadge'

export default function ListingCard({ item }) {
  return (
    <div className="bg-[#232326] rounded-lg p-3 flex flex-col">
      <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-white">{item.title}</span>
        <StatusBadge status={item.status} />
      </div>
      <div className="text-xs text-gray-400 mb-1">
        {item.bids} Bids
      </div>
      <div className="text-sm text-orange-400 font-bold">
        ${item.currentBid}
      </div>
    </div>
  )
}
