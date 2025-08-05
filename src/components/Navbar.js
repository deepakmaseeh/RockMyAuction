import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full bg-[#18181B] px-6 py-4 shadow flex justify-between items-center">
      <div className="text-2xl font-bold text-orange-500 tracking-wide">
        Rock the Auction
      </div>
      <ul className="flex gap-8 text-white text-base font-medium">
        <li><Link href="/" className="hover:text-orange-400 transition">Home</Link></li>
        <li><Link href="/dashboard" className="hover:text-orange-400 transition">Dashboard</Link></li>
        {/* <li><Link href="/auctions" className="hover:text-orange-400 transition">Auction</Link></li> */}
        <Link href="/auctions" className="hover:text-orange-400 transition">
  Auctions
</Link>
        <li><Link href="/about" className="hover:text-orange-400 transition">About</Link></li>
        {/* <li><Link href="/about" className="hover:text-orange-400 transition">About</Link></li> */}

        <li><Link href="/help-center" className="hover:text-orange-400 transition">Help</Link></li>
        <li><Link href="/user" className="hover:text-orange-400 transition">User</Link></li>
        {/* <li><Link href="/new-auction" className="hover:text-orange-400 transition">new-auction</Link></li> */}
        
        <li>
          <Link href="/auth/register">
            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 transition">Sign Up</button>
          </Link>
        </li>
      </ul>
    </nav>  
  );
}
