'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser } = useUserRole()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Thompson',
    email: user?.email || 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate collector of vintage watches and rare books. Been trading on Rock the Auction for 2 years.',
    website: 'https://alexcollects.com',
    profilePicture: user?.profilePicture || null,
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

  // Load profile picture from localStorage on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
    if (userData.profilePicture) {
      setFormData(prev => ({ ...prev, profilePicture: userData.profilePicture }))
    }
  }, [])

  const [stats] = useState({
    totalSales: 145,
    totalPurchases: 89,
    totalRevenue: 28450,
    totalSpent: 15230,
    rating: 4.8,
    reviewCount: 234,
    memberSince: '2022',
    successRate: 94
  })

  const [recentActivity] = useState([
    { type: 'sold', item: 'Vintage Rolex Datejust', amount: 2550, date: '2 days ago' },
    { type: 'won', item: 'First Edition Harry Potter', amount: 3500, date: '1 week ago' },
    { type: 'bid', item: 'Abstract Art Sculpture', amount: 2800, date: '3 days ago' },
    { type: 'listed', item: 'Baseball Card Collection', amount: 1500, date: '5 days ago' }
  ])

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

    try {
      // Read file as data URL for preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target.result
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }))
        
        // Update user context
        setUser(prev => ({ ...prev, profilePicture: imageUrl }))
        
        // Save to localStorage
        const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
        userData.profilePicture = imageUrl
        localStorage.setItem('user-data', JSON.stringify(userData))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload image')
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update user context
      setUser(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email
      }))
      
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sold': return '💰'
      case 'won': return '🏆'
      case 'bid': return '🏷️'
      case 'listed': return '📦'
      default: return '📍'
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'sold': return 'text-green-400'
      case 'won': return 'text-blue-400'
      case 'bid': return 'text-orange-400'
      case 'listed': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Mobile-optimized Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span><img src="/RMA-Logo.png" alt="Logo" className="h-12 content-center" /></span>
              {/* <span className="sm:hidden">RMA</span> */}
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition text-sm sm:text-base">
              <span className="hidden sm:inline">← Back to Dashboard</span>
              <span className="sm:hidden">← Back</span>
            </Link>
          </div>
        </div>
      </div>

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
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition border-4 border-[#18181B]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
              </div>
              
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-[#18181B] flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold">{formData.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-orange-400">
                  <span>⭐</span>
                  <span className="font-semibold">{stats.rating}</span>
                  <span className="text-gray-400 text-sm">({stats.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{formData.bio}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <span>📍 {formData.location}</span>
                <span>📅 Member since {stats.memberSince}</span>
                <span>✅ {stats.successRate}% success rate</span>
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

        {/* Mobile-responsive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.totalSales}</div>
            <div className="text-xs sm:text-sm text-gray-400">Items Sold</div>
          </div>
          <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalPurchases}</div>
            <div className="text-xs sm:text-sm text-gray-400">Items Bought</div>
          </div>
          <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-xl sm:text-3xl font-bold text-orange-400">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] text-center">
            <div className="text-xl sm:text-3xl font-bold text-purple-400">${stats.totalSpent.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-gray-400">Total Spent</div>
          </div>
        </div>

        {/* Mobile-optimized Tabs */}
        <div className="bg-[#18181B] rounded-lg sm:rounded-xl border border-[#232326] mb-6 sm:mb-8">
          <div className="flex overflow-x-auto border-b border-[#232326] scrollbar-hide">
            {[
              { key: 'profile', label: 'Profile Details', shortLabel: 'Profile', icon: '👤' },
              { key: 'notifications', label: 'Notifications', shortLabel: 'Alerts', icon: '🔔' },
              { key: 'privacy', label: 'Privacy', shortLabel: 'Privacy', icon: '🔒' },
              { key: 'activity', label: 'Recent Activity', shortLabel: 'Activity', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 text-sm sm:text-base resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 text-sm sm:text-base"
                  />
                </div>
                
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base"
                    >
                      Cancel
                    </button>
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

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#232326] rounded-lg hover:bg-[#2a2a2e] transition">
                      <div className="text-xl sm:text-2xl flex-shrink-0">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm sm:text-base truncate">{activity.item}</div>
                        <div className="text-xs sm:text-sm text-gray-400">{activity.date}</div>
                      </div>
                      <div className={`font-bold text-sm sm:text-base flex-shrink-0 ${getActivityColor(activity.type)}`}>
                        ${activity.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
