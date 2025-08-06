// import Link from "next/link"

// export default function Navbar() {
//   return (
//     <nav className="w-full bg-[#18181B] px-6 py-4 shadow flex justify-between items-center">
//       <div className="text-2xl font-bold text-orange-500 tracking-wide">
//         <img src="/RMA-LOGO.png" alt="Logo" className="h-12 w-auto inline-block" />
//       </div>
//       <ul className="flex gap-8 text-white text-base font-medium">
//         <li><Link href="/" className="hover:text-orange-400 transition">Home</Link></li>
//         <li><Link href="/dashboard" className="hover:text-orange-400 transition">Dashboard</Link></li>
//         {/* <li><Link href="/auctions" className="hover:text-orange-400 transition">Auction</Link></li> */}
//         <Link href="/auctions" className="hover:text-orange-400 transition">
//   Auctions
// </Link>
//         <li><Link href="/about" className="hover:text-orange-400 transition">About</Link></li>
//         {/* <li><Link href="/about" className="hover:text-orange-400 transition">About</Link></li> */}

//         <li><Link href="/help-center" className="hover:text-orange-400 transition">Help</Link></li>
//         <li><Link href="/profile" className="hover:text-orange-400 transition"><span>👤</span></Link></li>
//         {/* <li><Link href="/new-auction" className="hover:text-orange-400 transition">new-auction</Link></li> */}

//         <li>
//           <Link href="/auth/register">
//             <button className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 transition">Sign Up</button>
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }

"use client"; // Add this line at the top

import Link from "next/link";
import { useState } from "react";
import { useUserRole } from "@/contexts/RoleContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useUserRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <nav className="bg-[#18181B] border-b border-[#232326]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <img
              src="/RMA-LOGO.png"
              alt="Rock My Auction"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-orange-400 transition"
            >
              Home
            </Link>
            <Link
              href="/auctions"
              className="text-gray-300 hover:text-orange-400 transition"
            >
              Auctions
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-orange-400 transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-orange-400 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#232326]">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-orange-400 transition"
              >
                Home
              </Link>
              <Link
                href="/auctions"
                className="text-gray-300 hover:text-orange-400 transition"
              >
                Auctions
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-orange-400 transition"
                  >
                    Dashboard
                  </Link>
                  <span className="text-gray-400">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition self-start"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-orange-400 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition self-start"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
