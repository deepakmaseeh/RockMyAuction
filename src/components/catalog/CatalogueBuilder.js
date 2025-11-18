'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/contexts/RoleContext'
import { sampleData } from '@/lib/formAutoFill'
import auctionAPI from '@/lib/auctionAPI'

export default function CatalogueBuilder({ catalogueId, onSave, onCancel }) {
  const router = useRouter()
  const { userId, user, isAuthenticated } = useUserRole()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isClient, setIsClient] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [auctionDate, setAuctionDate] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('draft')

  // Ensure component only renders on client to avoid hydration errors
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-fill function
  const handleAutoFill = () => {
    const sample = sampleData.catalogue
    setTitle(sample.title)
    setDescription(sample.description)
    setCoverImage(sample.coverImage)
    setAuctionDate(sample.auctionDate)
    setLocation(sample.location)
    setStatus(sample.status)
    setSuccess('Form auto-filled with sample data!')
  }

  // Listen for chatbot form fill events
  useEffect(() => {
    const handleFillForm = (event) => {
      const data = event.detail
      if (data.title) setTitle(data.title)
      if (data.description) setDescription(data.description)
      if (data.coverImage) setCoverImage(data.coverImage)
      if (data.auctionDate) setAuctionDate(data.auctionDate)
      if (data.location) setLocation(data.location)
      if (data.status) setStatus(data.status)
      setSuccess('Form filled by chatbot!')
    }

    const handleClearForm = () => {
      setTitle('')
      setDescription('')
      setCoverImage('')
      setAuctionDate('')
      setLocation('')
      setStatus('draft')
      setSuccess('Form cleared!')
    }

    window.addEventListener('fill-catalogue-form', handleFillForm)
    window.addEventListener('clear-form', handleClearForm)

    return () => {
      window.removeEventListener('fill-catalogue-form', handleFillForm)
      window.removeEventListener('clear-form', handleClearForm)
    }
  }, [])

  // Load existing catalogue if editing
  useEffect(() => {
    if (catalogueId) {
      auctionAPI.getCatalogue(catalogueId)
        .then(response => {
          const cat = response.catalogue || response.data || response
          if (cat) {
            setTitle(cat.title || '')
            setDescription(cat.description || '')
            setCoverImage(cat.coverImage || '')
            setAuctionDate(cat.auctionDate ? new Date(cat.auctionDate).toISOString().slice(0, 16) : '')
            setLocation(cat.location || '')
            setStatus(cat.status || 'draft')
          }
        })
        .catch(err => {
          console.error('Error loading catalogue:', err)
          setError('Failed to load catalogue')
        })
    }
  }, [catalogueId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Require authentication
      if (!isAuthenticated || !userId) {
        throw new Error('You must be logged in to create a catalogue. Please login first.')
      }
      
      const currentUserId = userId

      const catalogueData = {
        title: title.trim(),
        description: description.trim(),
        coverImage,
        auctionDate,
        location: location.trim(),
        status,
        createdBy: currentUserId
      }

      let response
      if (catalogueId) {
        response = await auctionAPI.updateCatalogue(catalogueId, catalogueData)
      } else {
        response = await auctionAPI.createCatalogue(catalogueData)
      }

      const catalogue = response.catalogue || response.data || response
      
      if (!catalogue) {
        throw new Error(response.error || 'Failed to save catalogue')
      }

      setSuccess('Catalogue saved successfully!')
      
      if (onSave) {
        onSave(catalogue)
      } else {
        setTimeout(() => {
          router.push(`/catalogues/${catalogue._id || catalogue.id}`)
        }, 1000)
      }

    } catch (err) {
      console.error('Save catalogue error:', err)
      setError(err.message || 'Failed to save catalogue')
    } finally {
      setSubmitting(false)
    }
  }

  // Prevent hydration errors by not rendering until client-side
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl border border-orange-500/20 shadow-2xl">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl border border-orange-500/20 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {catalogueId ? 'Edit Catalogue' : 'Create New Catalogue'}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={handleAutoFill}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
        >
          ✨ Auto-Fill Form
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> You can also use the chatbot to fill this form! Just send an image of your item or say "fill catalogue form". The AI will analyze the image and automatically fill all fields!
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Catalogue Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="Enter catalogue title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="Enter catalogue description"
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="https://example.com/image.jpg"
          />
          {coverImage && (
            <div className="mt-2">
              <img src={coverImage} alt="Preview" className="max-w-xs rounded-lg border border-gray-700" />
            </div>
          )}
        </div>

        {/* Auction Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Auction Date *
          </label>
          <input
            type="datetime-local"
            value={auctionDate}
            onChange={(e) => setAuctionDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="Auction location"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : (catalogueId ? 'Update Catalogue' : 'Create Catalogue')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

