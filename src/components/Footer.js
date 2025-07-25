export default function Footer() {
  return (
    <footer className="bg-[#121212] text-gray-300 pt-10 pb-6 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Rock the Auction</h2>
          <p className="text-sm text-gray-400">
            Discover rare collectibles, bid with confidence, and rock every auction drop.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/auctions" className="hover:underline">Live Auctions</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/auth/login" className="hover:underline">Login</a></li>
            <li><a href="/auth/register" className="hover:underline">Register</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-white mb-3">Popular Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Luxury Watches</a></li>
            <li><a href="#" className="hover:underline">Sneakers</a></li>
            <li><a href="#" className="hover:underline">Vintage Art</a></li>
            <li><a href="#" className="hover:underline">Rare Comics</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-3">Join Our Newsletter</h3>
          <p className="text-sm mb-3 text-gray-400">Get exclusive drops and auction alerts.</p>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded bg-[#1e1e1e] border border-gray-700 text-sm text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-sm text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Rock the Auction. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
