'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import auctionAPI from '@/lib/auctionAPI'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useUserRole()
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    bio: '',
    website: '',
    avatar: user?.avatar || null
  })

  // Load user profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await auctionAPI.getCurrentUser();
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
            location: addressDisplay || prev.location,
            avatar: userData.avatar || prev.avatar
          }));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, [])

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
    setErrors(prev => ({ ...prev, avatar: '' }))
    
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
            setFormData(prev => ({ ...prev, avatar: uploadResponse.fileUrl }))
            setErrors(prev => ({ ...prev, avatar: '' }))
          } else {
            throw new Error('Upload failed - no URL returned');
          }
        } catch (error) {
          console.error('Profile photo upload error:', error);
          setErrors(prev => ({ ...prev, avatar: error.message || 'Failed to upload profile photo' }))
        } finally {
          setIsUploading(false)
        }
      };
      
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, avatar: 'Failed to read image file' }))
        setIsUploading(false)
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Profile photo upload error:', error);
      setErrors(prev => ({ ...prev, avatar: error.message || 'Failed to upload image' }))
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
      if (formData.avatar && formData.avatar.startsWith('http')) {
        profileData.profilePhoto = formData.avatar;
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
          avatar: updatedUserData.avatar || formData.avatar || user?.avatar,
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
        
        alert('Profile updated successfully!')
        // Navigate to profile page - it will reload data automatically
        router.push('/profile')
        // Force a refresh to ensure data is reloaded
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
      
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Mobile-Responsive Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-400 text-sm sm:text-base">Update your personal information and preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
          {/* Mobile-Responsive Avatar Upload */}
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Profile Picture</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="relative">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                    {formData.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs sm:text-sm">Uploading...</div>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer transition text-sm sm:text-base"
                >
                  Change Photo
                </label>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">JPG, PNG up to 5MB</p>
                {errors.avatar && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.avatar}</p>}
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Personal Information */}
          <div className="bg-[#18181B] rounded-xl p-4 sm:p-6 border border-[#232326]">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-3 sm:px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base ${
                    errors.name ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="lg:col-span-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-3 sm:px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="lg:col-span-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-3 sm:px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base ${
                    errors.phone ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="lg:col-span-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Enter your location"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full bg-[#232326] border rounded-lg px-3 sm:px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base ${
                    errors.website ? 'border-red-500' : 'border-[#333]'
                  }`}
                  placeholder="https://yourwebsite.com"
                />
                {errors.website && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.website}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base resize-none"
                  placeholder="Tell us about yourself..."
                />
                <div className="text-xs text-gray-400 mt-1">{formData.bio.length}/500 characters</div>
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="w-full sm:flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  )
}
