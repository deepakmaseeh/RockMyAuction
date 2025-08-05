'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useUserRole()
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Thompson',
    email: user?.email || 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate collector of vintage watches and rare books. Been trading on Rock the Auction for 2 years.',
    website: 'https://alexcollects.com',
    avatar: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }))
      return
    }

    setIsUploading(true)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }))
      setErrors(prev => ({ ...prev, avatar: '' }))
    } catch (error) {
      setErrors(prev => ({ ...prev, avatar: 'Failed to upload image' }))
    } finally {
      setIsUploading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !/^[\+]?[\d\s\(\)\-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update user context
      setUser(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email
      }))
      
      alert('Profile updated successfully!')
      router.push('/profile')
      
    } catch (error) {
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <img src="/rock_my_auction_logo.png" alt="Rock My Auction" className="h-8 w-auto" />
            </Link>
            <Link href="/profile" className="text-gray-400 hover:text-orange-400 transition">
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your personal information and preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Upload */}
          <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {formData.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer transition"
                >
                  Change Photo
                </label>
                <p className="text-gray-400 text-sm mt-2">JPG, PNG up to 5MB</p>
                {errors.avatar && <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                    errors.name ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                    errors.email ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                    errors.phone ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Enter your location"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 ${
                    errors.website ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="https://yourwebsite.com"
                />
                {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Tell us about yourself..."
                />
                <div className="text-xs text-gray-400 mt-1">{formData.bio.length}/500 characters</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
