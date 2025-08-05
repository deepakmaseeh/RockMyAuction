// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import AuctionCard from "@/components/AuctionCard";

// export default function HomePage() {
//   return (
//     <div className="bg-black text-white">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="p-6">
//         <div className="bg-cover bg-center rounded-lg p-40" style={{ backgroundImage: 'url("/assets/heroImage.jpeg")' }}>
//           <p className="text-blue-400 text-sm">⚡ LIVE COUNTDOWN</p>
//           <h1 className="text-4xl font-bold mt-2">One Drop. One Winner.</h1>
//           <p className="mt-2 text-sm text-gray-300">Discover, bid, and win exclusive items from luxury sneakers to rare art.</p>
//           <div className="mt-4 flex gap-4">
//             <span className="bg-black px-3 py-1 rounded">⏰ 01d 12h 30m</span>
//             <button className="bg-blue-600 px-4 py-1 rounded">Explore Live Auctions</button>
//           </div>
//         </div>
//       </section>

//       {/* Featured Auctions */}
//       <section className="p-6">
//         <h2 className="text-2xl font-bold mb-4">Featured Live Auctions</h2>
//         <div className="grid md:grid-cols-4 gap-6 m-1.5">
//           <AuctionCard   id="1" title='Air Max 1 "Elephant Print" 2007' price="5500" img="/assets/image.png" />
//           <AuctionCard   id="2" title="Rolex Daytona Ice Blue" price="98000" img="/assets/pngegg.png" />
//           <AuctionCard id="3" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="4" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="5" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="6" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="7" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="8" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="9" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="10" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="11" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//           <AuctionCard id="12" title='Basquiat-Inspired Canvas "Neo"' price="12000" img="/assets/carren-blue.png" />
//         </div>
//       </section>

      
      

//       {/* CTA */}
//       <section className="bg-pink-500 text-white text-center p-10 my-6 rounded-lg mx-6">
//         <h3 className="text-2xl font-bold">Ready to find your next gem?</h3>
//         <p className="mt-2">Dive into our extensive collection of live auctions. Your next valuable find awaits!</p>
//         <button className="mt-4 bg-white text-black px-4 py-2 rounded">Discover All Live Auctions →</button>
//       </section>

//       <Footer />
//     </div>
//   );
// } 

import Navbar from "../components/Navbar"
import AuctionCard from "../components/AuctionCard"
import CategoryCard from "../components/CategoryCard"
import Footer from "@/components/Footer"
import Link from "next/link"

const liveAuctions = [
  {
    image: "/assets/carren-blue.png", // Place images in /public
    title: 'Art Misc I "Elephant Print" 2021',
    currentBid: 6500,
    users: 34,
    endDate: "in 2h 30m",
  },
  {
    image: "/assets/carren-blue.png",
    title: 'Rolex Daytona Platinum/Ice Blue',
    currentBid: 98000,
    users: 83,
    endDate: "in 1h 12m",
  },
  {
    image: "/assets/carren-blue.png",
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

      {/* Hero section */}
      <section className="max-w-5xl mx-auto mt-12 px-6 flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-snug text-white">
            One Drop. One Winner.
          </h1>
          <p className="text-gray-300 mb-6 max-w-lg">
            Discover art, watches, collectibles, and more in exclusive live auctions—powered by AI for smarter selling and bidding.
          </p>
    
           <Link href="/auctions" className="inline-block bg-orange-500 hover:bg-orange-600 text-white rounded px-8 py-3 font-semibold shadow">Explore Live Auctions</Link>
           <br /> <Link href="/seller/new-auction">
              <button className="bg-green-500 hover:bg-green-600 text-white rounded px-8 py-3 m-3 font-semibold shadow transition">
                + Add New Auction
              </button>
            </Link>
        </div>
        {/* Optional: Add a hero image here */}
        <div className="flex-1 hidden md:block">
          <img src="/logo.png" alt="Hero" className="rounded-lg shadow-lg w-full h-auto" />
        </div>  
        
        
      </section>

      {/* Live Auctions */}
      <section className="max-w-5xl mx-auto mt-14 mb-6 px-6">
        <h2 className="text-2xl mb-4 font-bold">Featured Live Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveAuctions.map((auction, idx) => (
            <AuctionCard key={auction.title + idx} {...auction} />
          ))}
        </div>
        
      </section>

      {/* Trending Categories */}
      <section className="max-w-5xl mx-auto mt-14 mb-6 px-6">
        <h2 className="text-2xl mb-4 font-bold">Trending Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat.label + idx} {...cat} />
          ))}
        </div>
      </section>

      {/* Recently Ended Auctions */}
      <section className="max-w-5xl mx-auto mt-14 mb-6 px-6">
        <h2 className="text-2xl mb-4 font-bold">Recently Ended Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {endedAuctions.map((auction, idx) => (
            <AuctionCard key={auction.title + idx} {...auction} type="ended" />
          ))}
        </div>
      </section>

      {/* Discover More call-to-action */}
      <section className="max-w-5xl mx-auto mt-12 px-6">
        <div className="bg-orange-500 text-center text-white text-xl rounded-2xl py-8 font-semibold shadow">
          Ready to find your next gem?  
          <a
            href="/auctions"
            className="ml-4 inline-block bg-[#18181B] hover:bg-orange-700 text-orange-300 rounded px-6 py-2 font-bold transition"
          >
            Discover All Live Auctions →
          </a>
        </div>
      </section>
      
        
          
          
      {/* Footer */}
      <footer className="py-8 mt-10 text-center text-gray-400 text-sm">
        <Footer/> 
        {/* Made with <a href="https://www.visily.ai/" target="_blank" className="text-blue-400 underline">Visily</a> */}
      </footer>
    </div>
  );
}
