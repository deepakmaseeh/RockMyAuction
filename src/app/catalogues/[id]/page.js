'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function CatalogueDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [catalogue, setCatalogue] = useState(null)
  const [lots, setLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params?.id) {
      loadCatalogue()
      loadLots()
    }
  }, [params?.id])

  const loadCatalogue = async () => {
    try {
      const response = await fetch(`/api/catalogues/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setCatalogue(data.catalogue)
      } else {
        setError('Failed to load catalogue')
      }
    } catch (err) {
      console.error('Error loading catalogue:', err)
      setError('Failed to load catalogue')
    } finally {
      setLoading(false)
    }
  }

  const loadLots = async () => {
    try {
      const response = await fetch(`/api/lots?catalogue=${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setLots(data.lots || [])
      }
    } catch (err) {
      console.error('Error loading lots:', err)
    }
  }

  const handleDeleteLot = async (lotId) => {
    if (!confirm('Are you sure you want to delete this lot?')) {
      return
    }

    try {
      const response = await fetch(`/api/lots/${lotId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        loadLots()
        loadCatalogue()
      } else {
        alert('Failed to delete lot')
      }
    } catch (err) {
      console.error('Error deleting lot:', err)
      alert('Failed to delete lot')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      ready: 'bg-blue-500',
      sold: 'bg-green-500',
      unsold: 'bg-red-500'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-500'} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-400">Loading catalogue...</p>
        </div>
      </div>
    )
  }

  if (error || !catalogue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg mb-4">{error || 'Catalogue not found'}</p>
            <Link
              href="/catalogues"
              className="inline-block bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all"
            >
              Back to Catalogues
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/catalogues"
            className="text-orange-500 hover:text-orange-400 mb-4 inline-block"
          >
            ← Back to Catalogues
          </Link>
        </div>

        {/* Catalogue Info */}
        <div className="bg-[#1f1f23] rounded-xl border border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{catalogue.title}</h1>
              {catalogue.description && (
                <p className="text-gray-400 mb-4">{catalogue.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/catalogues/${catalogue._id}/edit`}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
              >
                Edit Catalogue
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {catalogue.auctionDate && (
              <div>
                <span className="text-gray-400">Auction Date:</span>
                <p className="text-white font-semibold">
                  {new Date(catalogue.auctionDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {catalogue.location && (
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-white font-semibold">{catalogue.location}</p>
              </div>
            )}
            <div>
              <span className="text-gray-400">Total Lots:</span>
              <p className="text-white font-semibold">{lots.length}</p>
            </div>
            {catalogue.metadata?.estimatedValue > 0 && (
              <div>
                <span className="text-gray-400">Estimated Value:</span>
                <p className="text-white font-semibold">
                  ${catalogue.metadata.estimatedValue.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {catalogue.coverImage && (
            <div className="mt-6">
              <img
                src={catalogue.coverImage}
                alt={catalogue.title}
                className="w-full max-w-2xl rounded-lg border border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Lots Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Lots ({lots.length})</h2>
          <Link
            href={`/catalogues/${catalogue._id}/lots/new`}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
          >
            + Add Lot
          </Link>
        </div>

        {lots.length === 0 ? (
          <div className="text-center py-12 bg-[#1f1f23] rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg mb-4">No lots in this catalogue</p>
            <Link
              href={`/catalogues/${catalogue._id}/lots/new`}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Add Your First Lot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lots.map((lot) => (
              <div
                key={lot._id}
                className="bg-[#1f1f23] rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all overflow-hidden"
              >
                {lot.images && lot.images.length > 0 && (
                  <img
                    src={lot.images[0]}
                    alt={lot.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-orange-500 font-bold">Lot {lot.lotNumber}</span>
                    {getStatusBadge(lot.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{lot.title}</h3>
                  
                  {lot.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {lot.description}
                    </p>
                  )}

                  <div className="space-y-1 mb-4 text-sm text-gray-400">
                    {lot.category && (
                      <div>Category: <span className="text-white">{lot.category}</span></div>
                    )}
                    {lot.estimatedValue > 0 && (
                      <div>Est. Value: <span className="text-white">${lot.estimatedValue.toLocaleString()}</span></div>
                    )}
                    {lot.startingPrice > 0 && (
                      <div>Starting: <span className="text-white">${lot.startingPrice.toLocaleString()}</span></div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/catalogues/${catalogue._id}/lots/${lot._id}/edit`}
                      className="flex-1 text-center bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-all text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteLot(lot._id)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

