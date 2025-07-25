import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import ListingCard from '../../components/ListingCard'

const stats = [
  { label: "Listed Items", value: "1,245", change: "+12.5% vs last month" },
  { label: "Active Bids", value: "328", change: "+5.1% vs last month" },
  { label: "Total Earnings", value: "$124,500", change: "+8.2% vs last month", color: "text-green-400" },
  { label: "Pending Listings", value: "12", change: "+2 from last week" },
]

const recentListings = [
  {
    image: "/img1.jpg",
    title: "Vintage Leica M3 Rangefind",
    status: "Approved",
    bids: 45,
    currentBid: "2,800.00"
  },
  {
    image: "/img2.jpg",
    title: "Rare 1889 Morgan Silver Do",
    status: "Approved",
    bids: 22,
    currentBid: "350.00"
  },
  {
    image: "/img3.jpg",
    title: "Limited Edition Sneakers - S",
    status: "Pending",
    bids: 0,
    currentBid: "0.00"
  },
  {
    image: "/img4.jpg",
    title: "Antique Gold Pocket Watch",
    status: "Approved",
    bids: 60,
    currentBid: "1,500.00"
  },
  {
    image: "/img5.jpg",
    title: "First Edition - Classic Novel",
    status: "Rejected",
    bids: 0,
    currentBid: "0.00"
  },
  {
    image: "/img6.jpg",
    title: "Collectible Anime Figurine",
    status: "Approved",
    bids: 18,
    currentBid: "120.00"
  }
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-8 text-white">Seller Dashboard Overview</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
        {/* Recent Listings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Recent Listings</h2>
          <a
            href="/seller/new-auction"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-semibold transition"
          >
            + Add New Item
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentListings.map((item, idx) => (
            <ListingCard key={item.title + idx} item={item} />
          ))}
        </div>
      </main>
    </div>
  )
}
