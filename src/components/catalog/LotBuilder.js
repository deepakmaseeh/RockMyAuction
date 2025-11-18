'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/contexts/RoleContext'
import { sampleData } from '@/lib/formAutoFill'
import auctionAPI from '@/lib/auctionAPI'

const categories = [
  "Electronics",
  "Art & Collectibles",
  "Jewelry & Watches",
  "Antiques & Vintage",
  "Fashion & Accessories",
  "Home & Garden",
  "Sports & Recreation",
  "Books & Media",
  "Toys & Games",
  "Musical Instruments",
  "Photography Equipment",
  "Automotive Parts",
  "Memorabilia",
  "Furniture",
  "Tools & Equipment"
]

const conditions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
]

export default function LotBuilder({ lotId, catalogueId, onSave, onCancel }) {
  const router = useRouter()
  const { userId, user, isAuthenticated } = useUserRole()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [catalogues, setCatalogues] = useState([])

  // Form state
  const [lotNumber, setLotNumber] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [condition, setCondition] = useState('good')
  const [estimatedValue, setEstimatedValue] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [provenance, setProvenance] = useState('')
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('')
  const [dimensionUnit, setDimensionUnit] = useState('cm')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [status, setStatus] = useState('draft')
  const [selectedCatalogue, setSelectedCatalogue] = useState(catalogueId || '')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')

  // Load catalogues
  useEffect(() => {
    auctionAPI.getCatalogues()
      .then(response => {
        const catalogues = response.catalogues || response.data || (Array.isArray(response) ? response : [])
        setCatalogues(catalogues)
        if (catalogueId && !selectedCatalogue) {
          setSelectedCatalogue(catalogueId)
        }
      })
      .catch(err => console.error('Error loading catalogues:', err))
  }, [catalogueId, selectedCatalogue])

  // Auto-generate next lot number when catalogue is selected and not editing
  useEffect(() => {
    if (selectedCatalogue && !lotId) {
      // Load existing lots for this catalogue to suggest next lot number
      auctionAPI.getLots({ catalogue: selectedCatalogue })
        .then(response => {
          const lots = response.lots || response.data || (Array.isArray(response) ? response : [])
          
          if (lots.length > 0) {
            // Find the highest lot number
            const lotNumbers = lots
              .map(lot => lot.lotNumber)
              .filter(num => num)
              .map(num => {
                // Extract numeric part from lot number
                const match = num.toString().match(/\d+/)
                return match ? parseInt(match[0], 10) : 0
              })
              .filter(num => !isNaN(num))
            
            if (lotNumbers.length > 0) {
              const maxNumber = Math.max(...lotNumbers)
              const nextNumber = maxNumber + 1
              // Format with leading zeros (3 digits: 001, 002, etc.)
              const nextLotNumber = String(nextNumber).padStart(3, '0')
              setLotNumber(nextLotNumber)
            } else {
              // No valid lot numbers found, start with 001
              setLotNumber('001')
            }
          } else {
            // No lots exist, start with 001
            setLotNumber('001')
          }
        })
        .catch(err => {
          console.error('Error loading lots for lot number suggestion:', err)
          // Default to 001 if there's an error
          setLotNumber('001')
        })
    }
  }, [selectedCatalogue, lotId])

  // Load existing lot if editing
  useEffect(() => {
    if (lotId) {
      auctionAPI.getLot(lotId)
        .then(response => {
          const lot = response.lot || response.data || response
          if (lot) {
            setLotNumber(lot.lotNumber || '')
            setTitle(lot.title || '')
            setDescription(lot.description || '')
            setImages(lot.images || [])
            setCategory(lot.category || categories[0])
            setCondition(lot.condition || 'good')
            setEstimatedValue(lot.estimatedValue?.toString() || '')
            setStartingPrice(lot.startingPrice?.toString() || '')
            setReservePrice(lot.reservePrice?.toString() || '')
            setProvenance(lot.provenance || '')
            setHeight(lot.dimensions?.height?.toString() || '')
            setWidth(lot.dimensions?.width?.toString() || '')
            setDepth(lot.dimensions?.depth?.toString() || '')
            setDimensionUnit(lot.dimensions?.unit || 'cm')
            setWeight(lot.weight?.value?.toString() || '')
            setWeightUnit(lot.weight?.unit || 'kg')
            setStatus(lot.status || 'draft')
            setSelectedCatalogue(lot.catalogue?._id || lot.catalogue || '')
            setTags((lot.metadata?.tags || []).join(', '))
            setNotes(lot.metadata?.notes || '')
          }
        })
        .catch(err => {
          console.error('Error loading lot:', err)
          setError('Failed to load lot')
        })
    }
  }, [lotId])

  const addImageUrl = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()])
      setImageUrl('')
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Auto-fill function
  const handleAutoFill = () => {
    const sample = sampleData.lot
    // Don't set lot number - it's auto-generated
    setTitle(sample.title)
    setDescription(sample.description)
    setImages(sample.images || [])
    setCategory(sample.category)
    setCondition(sample.condition)
    setEstimatedValue(sample.estimatedValue?.toString() || '')
    setStartingPrice(sample.startingPrice?.toString() || '')
    setReservePrice(sample.reservePrice?.toString() || '')
    setProvenance(sample.provenance)
    setHeight(sample.dimensions?.height?.toString() || '')
    setWidth(sample.dimensions?.width?.toString() || '')
    setDepth(sample.dimensions?.depth?.toString() || '')
    setDimensionUnit(sample.dimensions?.unit || 'cm')
    setWeight(sample.weight?.value?.toString() || '')
    setWeightUnit(sample.weight?.unit || 'kg')
    setStatus(sample.status)
    setTags((sample.metadata?.tags || []).join(', '))
    setNotes(sample.metadata?.notes || '')
    setSuccess('Form auto-filled with sample data!')
  }

  // Listen for chatbot form fill events
  useEffect(() => {
    const handleFillForm = (event) => {
      const data = event.detail
      // Don't set lot number - it's auto-generated
      if (data.title) setTitle(data.title)
      if (data.description) setDescription(data.description)
      if (data.images && Array.isArray(data.images)) {
        setImages(data.images)
      } else if (data.imageUrl) {
        // Single image URL
        setImages([data.imageUrl])
      }
      if (data.category) setCategory(data.category)
      if (data.condition) setCondition(data.condition)
      if (data.estimatedValue !== undefined) setEstimatedValue(data.estimatedValue.toString())
      if (data.startingPrice !== undefined) setStartingPrice(data.startingPrice.toString())
      if (data.reservePrice !== undefined) setReservePrice(data.reservePrice.toString())
      if (data.provenance) setProvenance(data.provenance)
      if (data.dimensions) {
        if (data.dimensions.height !== undefined) setHeight(data.dimensions.height.toString())
        if (data.dimensions.width !== undefined) setWidth(data.dimensions.width.toString())
        if (data.dimensions.depth !== undefined) setDepth(data.dimensions.depth.toString())
        if (data.dimensions.unit) setDimensionUnit(data.dimensions.unit)
      }
      if (data.weight) {
        if (data.weight.value !== undefined) setWeight(data.weight.value.toString())
        if (data.weight.unit) setWeightUnit(data.weight.unit)
      }
      if (data.status) setStatus(data.status)
      if (data.metadata?.tags) {
        setTags(Array.isArray(data.metadata.tags) ? data.metadata.tags.join(', ') : data.metadata.tags)
      } else if (data.tags) {
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : data.tags)
      }
      if (data.metadata?.notes) setNotes(data.metadata.notes)
      setSuccess('Form filled by chatbot!')
    }

    const handleClearForm = () => {
      setLotNumber('')
      setTitle('')
      setDescription('')
      setImages([])
      setCategory(categories[0])
      setCondition('good')
      setEstimatedValue('')
      setStartingPrice('')
      setReservePrice('')
      setProvenance('')
      setHeight('')
      setWidth('')
      setDepth('')
      setDimensionUnit('cm')
      setWeight('')
      setWeightUnit('kg')
      setStatus('draft')
      setTags('')
      setNotes('')
      setSuccess('Form cleared!')
    }

    window.addEventListener('fill-lot-form', handleFillForm)
    window.addEventListener('clear-form', handleClearForm)

    return () => {
      window.removeEventListener('fill-lot-form', handleFillForm)
      window.removeEventListener('clear-form', handleClearForm)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (!selectedCatalogue) {
        throw new Error('Please select a catalogue')
      }

      // Require authentication
      if (!isAuthenticated || !userId) {
        throw new Error('You must be logged in to create a lot. Please login first.')
      }
      
      const currentUserId = userId

      const lotData = {
        // Don't send lotNumber - backend always auto-generates it sequentially
        title: title.trim(),
        description: description.trim(),
        images: images || [],
        imageUrl: imageUrl || '',
        category,
        condition,
        estimatedValue: parseFloat(estimatedValue) || 0,
        startingPrice: parseFloat(startingPrice) || 0,
        reservePrice: parseFloat(reservePrice) || 0,
        provenance: provenance.trim(),
        dimensions: {
          height: height ? parseFloat(height) : undefined,
          width: width ? parseFloat(width) : undefined,
          depth: depth ? parseFloat(depth) : undefined,
          unit: dimensionUnit
        },
        weight: weight ? {
          value: parseFloat(weight),
          unit: weightUnit
        } : undefined,
        catalogue: selectedCatalogue,
        status,
        createdBy: currentUserId,
        metadata: {
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          notes: notes.trim()
        }
      }

      let response
      if (lotId) {
        response = await auctionAPI.updateLot(lotId, lotData)
      } else {
        response = await auctionAPI.createLot(lotData)
      }

      const lot = response.lot || response.data || response
      
      if (!lot) {
        throw new Error(response.error || 'Failed to save lot')
      }

      setSuccess('Lot saved successfully!')
      
      if (onSave) {
        onSave(lot)
      } else {
        setTimeout(() => {
          router.push(`/catalogues/${selectedCatalogue}`)
        }, 1000)
      }

    } catch (err) {
      console.error('Save lot error:', err)
      setError(err.message || 'Failed to save lot')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl border border-orange-500/20 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {lotId ? 'Edit Lot' : 'Create New Lot'}
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
            💡 <strong>Tip:</strong> You can also use the chatbot to fill this form! Just send an image of your item. The AI will analyze it and automatically extract title, description, category, condition, pricing, and more!
          </p>
        </div>

        {/* Catalogue Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Catalogue *
          </label>
          <select
            value={selectedCatalogue}
            onChange={(e) => setSelectedCatalogue(e.target.value)}
            required
            disabled={!!catalogueId}
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50"
          >
            <option value="">Select a catalogue</option>
            {catalogues.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Lot Number and Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lot Number *
              <span className="text-xs text-gray-400 ml-2">(Auto-generated)</span>
            </label>
            <input
              type="text"
              value={lotNumber || 'Loading...'}
              readOnly
              disabled
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
              placeholder="Auto-generated sequentially"
            />
            {!selectedCatalogue && (
              <p className="text-xs text-gray-500 mt-1">Select a catalogue to auto-generate lot number</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Lot title"
            />
          </div>
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
            placeholder="Detailed description of the lot"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Images
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Image URL"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
            >
              Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Lot ${index + 1}`} className="w-full h-24 object-cover rounded border border-gray-700" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              {conditions.map(cond => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Value
            </label>
            <input
              type="number"
              step="0.01"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Starting Price
            </label>
            <input
              type="number"
              step="0.01"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reserve Price
            </label>
            <input
              type="number"
              step="0.01"
              value={reservePrice}
              onChange={(e) => setReservePrice(e.target.value)}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Provenance */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Provenance
          </label>
          <textarea
            value={provenance}
            onChange={(e) => setProvenance(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="History and origin of the item"
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dimensions
          </label>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              step="0.01"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height"
              className="px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <input
              type="number"
              step="0.01"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Width"
              className="px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <input
              type="number"
              step="0.01"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              placeholder="Depth"
              className="px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <select
              value={dimensionUnit}
              onChange={(e) => setDimensionUnit(e.target.value)}
              className="px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="cm">cm</option>
              <option value="inches">inches</option>
            </select>
          </div>
        </div>

        {/* Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                className="flex-1 px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="kg">kg</option>
                <option value="grams">grams</option>
                <option value="lbs">lbs</option>
                <option value="oz">oz</option>
              </select>
            </div>
          </div>
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
              <option value="ready">Ready</option>
              <option value="sold">Sold</option>
              <option value="unsold">Unsold</option>
            </select>
          </div>
        </div>

        {/* Tags and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-[#1f1f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Additional notes"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : (lotId ? 'Update Lot' : 'Create Lot')}
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

