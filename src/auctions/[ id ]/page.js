import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AuctionCard from '../../components/AuctionCard'

const liveAuctions = [
  {
    slug: 'rolex-daytona-paul-newman',
    image: '/img1.jpg',
    title: 'Vintage Rolex Daytona "Paul Newman"',
    currentBid: 250000,
    endTime: "3h 46m left",
    users: 19,
  },
  {
    slug: 'kaws-companion-flayed',
    image: '/img2.jpg',
    title: 'KAWS Companion (Flayed) Limit...',
    currentBid: 55000,
    endTime: "2h 31m left",
    users: 34,
  },
  {
    slug: 'air-jordan-1-og-chicago',
    image: '/img3.jpg',
    title: 'Air Jordan 1 Retro High OG "Chicago"',
    currentBid: 18100,
    endTime: "1h 25m left",
    users: 42,
  },
  // Add more auctions as desired, matching your design
]

export default function LiveAuctionsPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {liveAuctions.map((auction, idx) => (
            <AuctionCard key={auction.slug} {...auction} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
