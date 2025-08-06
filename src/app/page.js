import Link from "next/link"
import Navbar from "@/components/Navbar"
import AuctionCard from "@/components/AuctionCard"
import CategoryCard from "@/components/CategoryCard"
import Footer from "@/components/Footer"

const liveAuctions = [
  {
    image: "/assets/PB-4.jpg",
    title: 'Art Misc I "Elephant Print" 2021',
    currentBid: 6500,
    users: 34,
    endDate: "in 2h 30m",
  },
  {
    image: "/assets/PB-2.jpg",
    title: 'Rossignol inspired Canvas "Neon"',
    currentBid: 12000,
    users: 21,
    endDate: "in 45m",
  },
  {
    image: "/assets/PB-1.jpg",
    title: 'Rossignol inspired Canvas "Neon"',
    currentBid: 12000,
    users: 21,
    endDate: "in 45m",
  },
  {
    image: "/assets/PB-4.jpg",
    title: 'Rossignol inspired Canvas "Neon"',
    currentBid: 12000,
    users: 21,
    endDate: "in 45m",
  },
  {
    image: "/assets/PB-2.jpg",
    title: 'Rolex Daytona Platinum/Ice Blue',
    currentBid: 98000,
    users: 83,
    endDate: "in 1h 12m",
  },
  {
    image: "/assets/destinationManali.jpg",
    title: 'Rossignol inspired Canvas "Neon"',
    currentBid: 12000,
    users: 21,
    endDate: "in 45m",
  },
]

const categories = [
  { label: "Memorabilia", icon: <span>🎤</span> },
  { label: "Watches", icon: <span>⌚</span> },
  { label: "Comics", icon: <span>📚</span> },
  { label: "Fine Art", icon: <span>🖼️</span> },
  { label: "Rare Shoes", icon: <span>👟</span> },
]

const endedAuctions = [
  {
    image: "/assets/lucknow-image.jpg",
    title: "Michael Jordan Signed Jersey",
    currentBid: 25000,
    users: 36,
    endDate: "1 day ago",
  },
  {
    image: "/assets/pngegg.png",
    title: "Action Comics #1 (Replica)",
    currentBid: 850,
    users: 10,
    endDate: "2 days ago",
  },
  {
    image: "/assets/carren-blue.png",
    title: "GI Joe 'Snake Eyes' 1982",
    currentBid: 320,
    users: 4,
    endDate: "3 days ago",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* Hero section - Mobile Optimized */}
      <section className="max-w-5xl mx-auto mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex-1 order-2 md:order-1">
            {/* Hero logo - Mobile responsive sizing */}
            <div className="flex-1 block md:hidden mb-6">
              <img 
                src="/RMA-Logo.png" 
                alt="Rock My Auction" 
                className="rounded-lg shadow-lg w-full h-auto max-w-xs mx-auto sm:max-w-sm" 
              />
            </div>

            {/* Desktop hero logo */}
            <div className="flex-1 hidden md:block mb-8 lg:mb-10">
              <img 
                src="/RMA-Logo.png" 
                alt="Rock My Auction" 
                className="rounded-lg shadow-lg w-full h-auto" 
              />
            </div>

            {/* Responsive heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-white text-center md:text-left">
              One Drop. One Winner.
            </h1>
            
            {/* Responsive description */}
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base max-w-lg text-center md:text-left mx-auto md:mx-0">
              Discover art, watches, collectibles, and more in exclusive live auctions —powered by AI for smarter selling and bidding.
            </p>

            {/* Mobile-friendly buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start">
              <Link 
                href="/auctions" 
                className="w-full sm:w-auto text-center bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 sm:px-8 py-3 font-semibold shadow transition-colors"
              >
                Explore Live Auctions
              </Link>
              <Link href="/seller/new-auction" className="w-full sm:w-auto">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 sm:px-8 py-3 font-semibold shadow transition-colors">
                  + Add New Auction
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auctions - Mobile Grid */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl mb-4 font-bold">Featured Live Auctions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {liveAuctions.map((auction, idx) => (
            <AuctionCard key={auction.title + idx} {...auction} />
          ))}
        </div>
      </section>

      {/* Trending Categories - Mobile Grid */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl mb-4 font-bold">Trending Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat.label + idx} {...cat} />
          ))}
        </div>
      </section>

      {/* Recently Ended Auctions - Mobile Grid */}
      <section className="max-w-5xl mx-auto mt-10 sm:mt-12 lg:mt-14 mb-6 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl mb-4 font-bold">Recently Ended Auctions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {endedAuctions.map((auction, idx) => (
            <AuctionCard key={auction.title + idx} {...auction} type="ended" />
          ))}
        </div>
      </section>

      {/* Call-to-action - Mobile Optimized */}
      <section className="max-w-5xl mx-auto mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-6">
        <div className="bg-orange-500 text-center text-white rounded-2xl py-6 sm:py-8 px-4 font-semibold shadow">
          <div className="text-lg sm:text-xl mb-4 sm:mb-0 sm:inline">
            Ready to find your next gem?
          </div>
          <Link
            href="/auctions"
            className="inline-block w-full sm:w-auto sm:ml-4 mt-3 sm:mt-0 bg-[#18181B] hover:bg-orange-700 text-orange-300 rounded-lg px-4 sm:px-6 py-2 sm:py-2 font-bold transition-colors"
          >
            <span className="block sm:inline">Discover All Live Auctions</span>
            <span className="hidden sm:inline ml-1">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 mt-8 sm:mt-10 text-center text-gray-400 text-sm">
        <Footer/> 
      </footer>
    </div>
  );
}
