import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-gray-300 pt-10 pb-6 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
           <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition"
          >
            <img
              src="/RMA-Logo.png"
              alt="Rock My Auction"
              className="h-8 sm:h-10 md:h-18 w-auto" // Responsive logo sizing
            />
          </Link>
          <h2 className="text-1xl font-bold text-white mb-2">One Auction Platform <br/> to Combine Them All</h2>
          <p className="text-sm text-gray-400">
            Discover rare collectibles, bid with confidence, and rock every auction drop.
          </p> 
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/auctions" className="hover:underline">Live Auctions</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link href="/auth/login" className="hover:underline">Login</Link></li>
            <li><Link href="/auth/register" className="hover:underline">Register</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-white mb-3">Popular Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:underline">Luxury Watches</Link></li>
            <li><Link href="#" className="hover:underline">Sneakers</Link></li>
            <li><Link href="#" className="hover:underline">Vintage Art</Link></li>
            <li><Link href="#" className="hover:underline">Rare Comics</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-3">Join Our Newsletter</h3>
          <p className="text-sm mb-3 text-gray-400">Get exclusive drops and auction alerts.</p>
        
<form className="flex flex-col sm:flex-row gap-2">
  <input
    type="email"
    placeholder="Your email"
    className="w-full px-3 py-2 rounded bg-[#1e1e1e] border border-gray-700 text-sm text-white focus:outline-none focus:border-orange-500"
    suppressHydrationWarning={true} // Add this
  />
  <button
    type="submit"
    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
    suppressHydrationWarning={true} // Add this
  >
    Subscribe
  </button>
</form>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-sm text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Rock My Auction. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
