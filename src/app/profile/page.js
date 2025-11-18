'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import { useWatchlist } from '@/contexts/WishlistContext'
import WishlistButton from '@/components/WishlistButton'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import auctionAPI from '@/lib/auctionAPI'

function ProfilePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, setUser, isAuthenticated, logout } = useUserRole()
  const { watchlistItems, loading: wishlistLoading, loadWatchlist } = useWatchlist()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Get initial tab from URL parameter
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    return (tab && ['profile', 'wishlist', 'notifications', 'privacy'].includes(tab)) ? tab : 'profile';
  })
  
  // Update tab when URL parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'wishlist', 'notifications', 'privacy'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams])
  
  // Load wishlist when wishlist tab is active (only once per tab switch)
  useEffect(() => {
    if (activeTab === 'wishlist' && isAuthenticated && !wishlistLoading) {
      loadWatchlist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated]) // Don't include loadWatchlist to prevent loops
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    bio: '',
    website: '',
    profilePicture: user?.avatar || null,
    notifications: {
      email: true,
      sms: false,
      push: true,
      bidding: true,
      outbid: true,
      won: true,
      messages: true
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showActivity: true
    }
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load user profile data from API on mount and when user changes
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await auctionAPI.getCurrentUser();
        console.log('Profile data loaded:', response);
        
        if (response.success && response.data) {
          const userData = response.data;
          // Handle address - convert object to string if needed
          let addressDisplay = '';
          if (userData.address) {
            if (typeof userData.address === 'string') {
              addressDisplay = userData.address;
            } else if (typeof userData.address === 'object') {
              // Format address object as string for display
              const addr = userData.address;
              if (addr.country) {
                addressDisplay = addr.country;
              } else if (addr.city) {
                addressDisplay = addr.city;
              } else if (addr.street) {
                addressDisplay = [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(', ');
              }
            }
          }
          
          setFormData(prev => ({
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            address: addressDisplay || prev.address,
            location: addressDisplay || userData.location || prev.location,
            bio: userData.bio || prev.bio,
            website: userData.website || prev.website,
            profilePicture: userData.avatar || prev.profilePicture
          }));
          
          // Update user context with complete data
          setUser({
            ...user,
            id: userData._id || userData.id || user?.id,
            _id: userData._id || userData.id || user?._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            avatar: userData.avatar
          });
        } else if (response.data) {
          // Handle case where response.data is the user object directly
          const userData = response.data;
          // Handle address - convert object to string if needed
          let addressDisplay = '';
          if (userData.address) {
            if (typeof userData.address === 'string') {
              addressDisplay = userData.address;
            } else if (typeof userData.address === 'object') {
              // Format address object as string for display
              const addr = userData.address;
              if (addr.country) {
                addressDisplay = addr.country;
              } else if (addr.city) {
                addressDisplay = addr.city;
              } else if (addr.street) {
                addressDisplay = [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(', ');
              }
            }
          }
          
          setFormData(prev => ({
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            address: addressDisplay || prev.address,
            location: addressDisplay || userData.location || prev.location,
            bio: userData.bio || prev.bio,
            website: userData.website || prev.website,
            profilePicture: userData.avatar || prev.profilePicture
          }));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, [isAuthenticated, user?._id]) // Reload when user ID changes

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      router.push('/');
    }
  }


  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
          
          // Upload to GCS
          const uploadResponse = await auctionAPI.uploadProfilePhoto({
            file: base64String,
            fileName: file.name,
            fileType: file.type
          });

          if (uploadResponse.success && uploadResponse.fileUrl) {
            // Update form data with the new profile photo URL
            setFormData(prev => ({ ...prev, profilePicture: uploadResponse.fileUrl }))
            
            // Update user context
            setUser(prev => ({
              ...prev,
              avatar: uploadResponse.fileUrl
            }))
            
            // Save to localStorage
            let userData = {};
            try {
              const storedUserData = localStorage.getItem('user-data');
              if (storedUserData && storedUserData !== 'undefined' && storedUserData !== 'null') {
                userData = JSON.parse(storedUserData);
              }
            } catch (parseError) {
              console.error('Failed to parse user-data from localStorage:', parseError);
              userData = {};
            }
            userData.avatar = uploadResponse.fileUrl
            localStorage.setItem('user-data', JSON.stringify(userData))
          } else {
            throw new Error('Upload failed - no URL returned');
          }
        } catch (error) {
          console.error('Profile photo upload error:', error);
          alert(error.message || 'Failed to upload profile photo')
        } finally {
          setIsUploading(false)
        }
      };
      
      reader.onerror = () => {
        alert('Failed to read image file')
        setIsUploading(false)
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload image')
      setIsUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Prepare profile data
      // Handle address - can be string or object
      let addressValue = '';
      if (formData.address) {
        if (typeof formData.address === 'string') {
          addressValue = formData.address.trim();
        } else if (typeof formData.address === 'object') {
          // If address is an object, extract country or format as string
          addressValue = formData.address.country || formData.address.city || 
                        (formData.address.street ? `${formData.address.street}, ${formData.address.city || ''}, ${formData.address.country || ''}`.trim() : '') || '';
        }
      }
      if (!addressValue && formData.location) {
        addressValue = typeof formData.location === 'string' ? formData.location.trim() : '';
      }
      
      const profileData = {
        name: formData.name?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        address: addressValue
      };
      
      console.log('Sending profile update:', profileData);

      // Include profile photo if it was uploaded
      if (formData.profilePicture && formData.profilePicture.startsWith('http')) {
        profileData.profilePhoto = formData.profilePicture;
      }

      // Update profile via API
      let response;
      try {
        response = await auctionAPI.updateUserProfile(profileData);
        console.log('Profile update response:', response);
      } catch (apiError) {
        console.error('API Error:', apiError);
        throw new Error(apiError.message || 'Failed to update profile. Please try again.');
      }
      
      // Check if response is valid
      if (!response) {
        throw new Error('No response from server. Please try again.');
      }
      
      if (response.success) {
        // Get updated user data from response
        const updatedUserData = response.data || response;
        
        // Update user context with complete data from backend
        const updatedUser = {
          id: updatedUserData._id || updatedUserData.id || user?.id,
          _id: updatedUserData._id || updatedUserData.id || user?._id,
          name: updatedUserData.name || formData.name,
          email: updatedUserData.email || formData.email,
          phone: updatedUserData.phone || formData.phone,
          avatar: updatedUserData.avatar || formData.profilePicture || user?.avatar,
          address: updatedUserData.address || formData.address
        };
        
        console.log('Updating user context with:', updatedUser);
        setUser(updatedUser);
        
        // Update localStorage with complete user data
        try {
          const storedUserData = localStorage.getItem('user-data');
          let userData = {};
          
          if (storedUserData && storedUserData !== 'undefined' && storedUserData !== 'null') {
            try {
              userData = JSON.parse(storedUserData);
            } catch (parseError) {
              console.error('Failed to parse user-data from localStorage:', parseError);
              userData = {};
            }
          }
          
          // Update with all fields from backend response
          userData.id = updatedUser.id;
          userData._id = updatedUser._id;
          userData.name = updatedUser.name;
          userData.email = updatedUser.email;
          userData.phone = updatedUser.phone;
          if (updatedUser.avatar) {
            userData.avatar = updatedUser.avatar;
          }
          if (updatedUser.address) {
            userData.address = updatedUser.address;
          }
          
          localStorage.setItem('user-data', JSON.stringify(userData));
          console.log('Updated localStorage:', userData);
        } catch (storageError) {
          console.error('Failed to update localStorage:', storageError);
          // Continue even if localStorage update fails
        }
        
        setIsEditing(false)
        alert('Profile updated successfully!')
        
        // Reload profile data from API to ensure we have the latest
        try {
          const reloadResponse = await auctionAPI.getCurrentUser();
          if (reloadResponse.success && reloadResponse.data) {
            const userData = reloadResponse.data;
            // Handle address - convert object to string if needed
            let addressDisplay = '';
            if (userData.address) {
              if (typeof userData.address === 'string') {
                addressDisplay = userData.address;
              } else if (typeof userData.address === 'object') {
                // Format address object as string for display
                const addr = userData.address;
                if (addr.country) {
                  addressDisplay = addr.country;
                } else if (addr.city) {
                  addressDisplay = addr.city;
                } else if (addr.street) {
                  addressDisplay = [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(', ');
                }
              }
            }
            
            setFormData(prev => ({
              ...prev,
              name: userData.name || prev.name,
              email: userData.email || prev.email,
              phone: userData.phone || prev.phone,
              address: addressDisplay || prev.address,
              location: addressDisplay || userData.location || prev.location,
              bio: userData.bio || prev.bio,
              website: userData.website || prev.website,
              profilePicture: userData.avatar || prev.profilePicture
            }));
          }
        } catch (reloadError) {
          console.error('Failed to reload profile:', reloadError);
        }
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile-optimized Profile Header */}
        <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-[#232326] mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative self-center sm:self-start">
              <div className="relative">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt={formData.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-orange-500"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                    {formData.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                )}
                
                {/* Upload Button */}
                {isEditing && (
                  <label className={`absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition border-4 border-[#18181B] ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold">{formData.name}</h1>
              </div>
              {formData.bio && (
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed line-clamp-2">{formData.bio}</p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-400">
                {formData.location && <span>📍 {formData.location}</span>}
                {user?.createdAt && (
                  <span>📅 Member since {new Date(user.createdAt).getFullYear()}</span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base w-full sm:w-auto"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>


        {/* Mobile-optimized Tabs */}
        <div className="bg-[#18181B] rounded-lg sm:rounded-xl border border-[#232326] mb-6 sm:mb-8">
          <div className="flex overflow-x-auto border-b border-[#232326] scrollbar-hide">
            {[
              { key: 'profile', label: 'Profile Details', shortLabel: 'Profile', icon: '👤' },
              { key: 'wishlist', label: 'My Wishlist', shortLabel: 'Wishlist', icon: '❤️' },
              { key: 'notifications', label: 'Notifications', shortLabel: 'Alerts', icon: '🔔' },
              { key: 'privacy', label: 'Privacy', shortLabel: 'Privacy', icon: '🔒' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  // Update URL without page reload
                  const url = new URL(window.location.href)
                  url.searchParams.set('tab', tab.key)
                  window.history.pushState({}, '', url)
                }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition whitespace-nowrap touch-manipulation ${
                  activeTab === tab.key
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-white active:text-orange-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm sm:text-base sm:hidden">{tab.shortLabel}</span>
                <span className="text-sm sm:text-base hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {/* Profile Details Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Professional Profile Display */}
                {!isEditing ? (
                  <div className="space-y-6">
                    {/* Personal Information Section */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 pb-2 border-b border-[#232326]">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">Full Name</label>
                          <div className="text-base sm:text-lg text-white font-medium py-2">{formData.name || 'Not provided'}</div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">Email Address</label>
                          <div className="text-base sm:text-lg text-white font-medium py-2">{formData.email || 'Not provided'}</div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">Phone Number</label>
                          <div className="text-base sm:text-lg text-white font-medium py-2">{formData.phone || 'Not provided'}</div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">Location</label>
                          <div className="text-base sm:text-lg text-white font-medium py-2">{formData.location || 'Not provided'}</div>
                        </div>
                        {formData.website && (
                          <div className="space-y-1 md:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">Website</label>
                            <a 
                              href={formData.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-base sm:text-lg text-orange-400 hover:text-orange-300 font-medium py-2 inline-block transition"
                            >
                              {formData.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio Section */}
                    {formData.bio && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 pb-2 border-b border-[#232326]">About</h3>
                        <div className="bg-[#232326] rounded-lg p-4 sm:p-6 border border-[#333]">
                          <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{formData.bio}</p>
                        </div>
                      </div>
                    )}

                    {/* Edit Button */}
                    <div className="pt-4">
                      <Link
                        href="/profile/edit"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition text-sm sm:text-base cursor-pointer select-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode - Form Fields */
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base cursor-pointer select-none"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base cursor-pointer select-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold">Notification Preferences</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-medium text-gray-300 text-sm sm:text-base">Delivery Methods</h4>
                    {Object.entries({
                      email: 'Email notifications',
                      sms: 'SMS notifications',
                      push: 'Push notifications'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#232326] transition">
                        <input
                          type="checkbox"
                          name={`notifications.${key}`}
                          checked={formData.notifications[key]}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-gray-300 text-sm sm:text-base">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-medium text-gray-300 text-sm sm:text-base">Event Types</h4>
                    {Object.entries({
                      bidding: 'New bids on my items',
                      outbid: 'When I get outbid',
                      won: 'Auction wins',
                      messages: 'New messages'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#232326] transition">
                        <input
                          type="checkbox"
                          name={`notifications.${key}`}
                          checked={formData.notifications[key]}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-gray-300 text-sm sm:text-base">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold">Privacy Settings</h3>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries({
                    showEmail: 'Show email address on profile',
                    showPhone: 'Show phone number on profile',
                    showLocation: 'Show location on profile',
                    showActivity: 'Show recent activity on profile'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer py-3 px-4 bg-[#232326] rounded-lg hover:bg-[#2a2a2e] transition">
                      <span className="text-gray-300 text-sm sm:text-base">{label}</span>
                      <input
                        type="checkbox"
                        name={`privacy.${key}`}
                        checked={formData.privacy[key]}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500 focus:ring-2"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold">My Wishlist</h3>
                  <span className="text-sm text-gray-400">
                    {wishlistLoading ? 'Loading...' : `${watchlistItems.length} item${watchlistItems.length !== 1 ? 's' : ''}`}
                  </span>
                </div>
                
                {wishlistLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : watchlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💔</div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-2">Your wishlist is empty</h4>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">Start exploring auctions and save your favorites by clicking the wishlist icon.</p>
                    <Link
                      href="/auctions"
                      className="inline-block bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                    >
                      Discover Auctions
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {watchlistItems.map((item) => {
                      const auction = item.auction || item
                      const auctionId = auction._id || auction.id || item.id
                      const timeLeft = auction.endDate ? new Date(auction.endDate) - new Date() : 0
                      const isEnded = timeLeft <= 0
                      
                      return (
                        <div
                          key={auctionId}
                          className="bg-[#232326] rounded-lg sm:rounded-xl border border-[#333] overflow-hidden hover:border-orange-500/50 transition cursor-pointer group"
                          onClick={() => router.push(`/auctions/${auctionId}`)}
                        >
                          <div className="relative w-full h-40 sm:h-48">
                            <img
                              src={auction.imageUrl || auction.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                              alt={auction.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                if (!e.target.src.includes('data:image')) {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
                                }
                              }}
                            />
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                isEnded ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
                              }`}>
                                {isEnded ? 'ENDED' : 'LIVE'}
                              </span>
                            </div>
                            <div 
                              className="absolute top-2 right-2 z-10"
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                              }}
                            >
                              <WishlistButton 
                                auction={auction} 
                                auctionId={auctionId}
                                size="sm" 
                              />
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-semibold text-white text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-orange-400 transition">
                              {auction.title}
                            </h4>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-orange-400 font-bold text-sm sm:text-lg">
                                  ${(auction.currentBid || auction.startingPrice || 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">Current Bid</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                                  {auction.bidCount || auction.bids?.length || 0} bids
                                </div>
                                <div className="text-xs text-gray-500">
                                  {isEnded ? 'Ended' : new Date(auction.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/auctions/${auctionId}`)
                              }}
                              className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition ${
                                isEnded
                                  ? 'bg-gray-600 text-gray-300'
                                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                              }`}
                            >
                              {isEnded ? 'View Results' : 'Place Bid'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  )
}
