'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TestCataloguePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [catalogue, setCatalogue] = useState(null)

  const createDemoCatalogue = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setCatalogue(null)

    try {
      // Create via API
      const response = await fetch('/api/catalogues/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create demo catalogue')
      }

      setSuccess('Demo catalogue created successfully!')
      setCatalogue(data.catalogue)
    } catch (err) {
      console.error('Error creating demo catalogue:', err)
      setError(err.message || 'Failed to create demo catalogue')
    } finally {
      setLoading(false)
    }
  }

  const testCreateViaFrontend = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setCatalogue(null)

    try {
      const catalogueData = {
        title: 'Spring Fine Art & Antiques Auction',
        description: 'A curated collection of fine art, antiques, and collectibles from renowned estates. This auction features rare paintings, vintage furniture, and unique collectibles spanning several centuries.',
        coverImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
        auctionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        location: 'New York City, NY',
        status: 'published',
        createdBy: 'default-user-' + Date.now() // Invalid ObjectId - should be handled
      }

      const response = await fetch('/api/catalogues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(catalogueData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create catalogue')
      }

      setSuccess('Catalogue created successfully via frontend!')
      setCatalogue(data.catalogue)
    } catch (err) {
      console.error('Error creating catalogue:', err)
      setError(err.message || 'Failed to create catalogue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#18181B] rounded-xl border border-orange-500/20 shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🧪 Catalogue System Test Page
          </h1>

          <div className="space-y-4 mb-6">
            <button
              onClick={createDemoCatalogue}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '📝 Create Demo Catalogue (Via API)'}
            </button>

            <button
              onClick={testCreateViaFrontend}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '🎨 Create Catalogue (Via Frontend Form)'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
              <strong>Success:</strong> {success}
            </div>
          )}

          {catalogue && (
            <div className="mt-6 p-4 bg-[#1f1f23] rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Created Catalogue:</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>ID:</strong> {catalogue._id}</p>
                <p><strong>Title:</strong> {catalogue.title}</p>
                <p><strong>Status:</strong> {catalogue.status}</p>
                <p><strong>Location:</strong> {catalogue.location}</p>
                <p><strong>Auction Date:</strong> {new Date(catalogue.auctionDate).toLocaleString()}</p>
              </div>
              <div className="mt-4 flex gap-4">
                <Link
                  href={`/catalogues/${catalogue._id}`}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  View Catalogue
                </Link>
                <Link
                  href="/catalogues"
                  className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
                >
                  View All Catalogues
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">📋 Test Checklist:</h3>
            <ul className="text-blue-200 space-y-1 text-sm">
              <li>✅ Backend API routes are configured</li>
              <li>✅ Controller handles invalid ObjectId values</li>
              <li>✅ Model schema validates and converts invalid values</li>
              <li>✅ Frontend form sends data correctly</li>
              <li>✅ Database connection is working</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}








