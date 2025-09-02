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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section - Responsive sizing */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition"
          >
            <img
              src="/RMA-Logo.png"
              alt="Rock My Auction"
              className="h-8 sm:h-10 md:h-12 w-auto" // Responsive logo sizing
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
            >
              Home
            </Link>
            <Link
              href="/auctions"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
            >
              Auctions
            </Link>
            {/* <Link
              href="/categories"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
            >
              Categories
            </Link> */}
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            <Link
              href="/about"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
            >
              About
            </Link>
            <Link
              href="/help-center" className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
            >
              Help
            </Link>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 lg:gap-4">
                  <span className="text-gray-400 text-sm lg:text-base">
                    Welcome, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition text-sm lg:text-base"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 lg:gap-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition text-sm lg:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 -mr-2" // Added padding for better touch target
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6" // Responsive icon size
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                // Close icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#232326]">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Home
              </Link>
              <Link
                href="/auctions"
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Auctions
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-orange-400 transition py-2 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-orange-400 transition py-2 text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-orange-400 transition py-2 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >about</Link>
              <Link
                href="/help-center"
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="py-2 border-t border-[#232326] mt-2 pt-4">
                    <span className="text-gray-400 text-sm block mb-3">
                      Welcome, {user?.name}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm w-full sm:w-auto"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-[#232326] mt-2 space-y-3">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-orange-400 transition py-2 text-base block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
