// "use client";
// import Link from "next/link";
// import { useState } from "react";

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="bg-black text-white px-4 sm:px-10 py-4 shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold text-orange-500">Rock the Auction</Link>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-8 text-sm">
//           <Link href="/auctions" className="hover:text-orange-400">Auctions</Link>
//           <Link href="/dashboard" className="hover:text-orange-400">Dashboard</Link>
//           <Link href="/help" className="hover:text-orange-400">Help</Link>
//         </nav>

//         {/* User Area */}
//         <div className="hidden md:flex items-center gap-4 text-sm">
//           <Link href="/auth/login" className="hover:underline">Login</Link>
//           <Link href="/auth/register" className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">Sign Up</Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden focus:outline-none"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           <span className="material-icons">{mobileMenuOpen ? "close" : "menu"}</span>
//         </button>
//       </div>

//       {/* Mobile Nav */}
//       {mobileMenuOpen && (
//         <div className="md:hidden mt-4 space-y-4 text-sm">
//           <Link href="/auctions" className="block hover:text-orange-400">Auctions</Link>
//           <Link href="/dashboard" className="block hover:text-orange-400">Dashboard</Link>
//           <Link href="/help" className="block hover:text-orange-400">Help</Link>
//           <Link href="/auth/login" className="block hover:underline">Login</Link>
//           <Link href="/auth/register" className="block text-white bg-orange-500 px-3 py-2 rounded">Sign Up</Link>
//         </div>
//       )}
//     </header>
//   )
