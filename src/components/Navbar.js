"use client"; // Add this line at the top

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/contexts/RoleContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useUserRole();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      setIsProfileDropdownOpen(false);
      router.push('/');
    }
  };

  const handleEditProfile = () => {
    setIsProfileDropdownOpen(false);
    router.push('/profile/edit');
  };

  const handleViewProfile = () => {
    setIsProfileDropdownOpen(false);
    router.push('/profile');
  };

  const handleNavigate = (path) => {
    setIsProfileDropdownOpen(false);
    router.push(path);
  };

  return (
    <nav className="bg-[#18181B] border-b border-[#232326] font-sans select-none">
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
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
            >
              Home
            </Link>
            <Link
              href="/auctions"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
            >
              Auctions
            </Link>
            <Link
              href="/catalogues"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
            >
              Catalogs
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
                  className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            <Link
              href="/about"
              className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
            >
              About
            </Link>
            <Link
              href="/help-center" className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
            >
              Help
            </Link>

            {isAuthenticated && user ? (
              <>
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none cursor-pointer select-none"
                    title="Profile Menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || 'Profile'}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-orange-500 cursor-pointer select-none pointer-events-auto"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base border-2 border-orange-500 cursor-pointer select-none pointer-events-auto ${user?.avatar ? 'hidden' : ''}`}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#18181B] border border-[#232326] rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="py-1">
                        {/* Profile Section */}
                        <button
                          onClick={handleViewProfile}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Profile</span>
                        </button>
                        <button
                          onClick={handleEditProfile}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Profile</span>
                        </button>
                        
                        <div className="border-t border-[#232326] my-1"></div>
                        
                        {/* Quick Access Section */}
                        <button
                          onClick={() => handleNavigate('/dashboard')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleNavigate('/my-auctions')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>My Auctions</span>
                        </button>
                        <button
                          onClick={() => handleNavigate('/bids')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>My Bids</span>
                        </button>
                        <button
                          onClick={() => handleNavigate('/purchases')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>My Purchases</span>
                        </button>
                        <button
                          onClick={() => router.push('/profile?tab=wishlist')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Wishlist</span>
                        </button>
                        
                        <div className="border-t border-[#232326] my-1"></div>
                        
                        {/* Account Management Section */}
                        <button
                          onClick={() => handleNavigate('/settings')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => handleNavigate('/wallet')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Wallet</span>
                        </button>
                        <button
                          onClick={() => handleNavigate('/messages')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <span>Notifications</span>
                        </button>
                        
                        <div className="border-t border-[#232326] my-1"></div>
                        
                        {/* Support Section */}
                        <button
                          onClick={() => handleNavigate('/help-center')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232326] hover:text-white transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Help Center</span>
                        </button>
                        
                        <div className="border-t border-[#232326] my-1"></div>
                        
                        {/* Logout Section */}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#232326] hover:text-red-300 transition flex items-center gap-3 cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 lg:gap-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-orange-400 transition text-sm lg:text-base cursor-pointer select-none"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition text-sm lg:text-base cursor-pointer select-none"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 -mr-2 cursor-pointer select-none" // Added padding for better touch target
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
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Home
              </Link>
              <Link
                href="/auctions"
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Auctions
              </Link>
              <Link
                href="/catalogues"
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogs
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                    onClick={() => setIsMenuOpen(false)}
                  >about</Link>
              <Link
                href="/help-center"
                className="text-gray-300 hover:text-orange-400 transition py-2 text-base cursor-pointer select-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              {isAuthenticated && user ? (
                <>
                  <div className="py-2 border-t border-[#232326] mt-2 pt-4 space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#232326] transition cursor-pointer select-none"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user?.name || 'Profile'}
                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base border-2 border-orange-500 ${user?.avatar ? 'hidden' : ''}`}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-gray-300 text-sm">
                        {user?.name || 'Profile'}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-2 text-sm text-red-400 hover:bg-[#232326] rounded-lg transition flex items-center gap-2 cursor-pointer select-none"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-[#232326] mt-2 space-y-3">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-orange-400 transition py-2 text-base block cursor-pointer select-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm inline-block cursor-pointer select-none"
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
