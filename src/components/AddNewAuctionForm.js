'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

export default function AddNewAuctionForm() {
  const router = useRouter()
  const dropRef = useRef(null)
  
  // Form state
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState('')
  const [startingBid, setStartingBid] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  
  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Handle image upload and trigger AI analysis
  const handleImageUpload = async (file) => {
    if (!file) return

    setImage(file)
    setPreview(URL.createObjectURL(file))
    setAnalysisComplete(false)
    setAnalysisError('')
    setIsAnalyzing(true)

    try {
      // Create FormData for API call
      const formData = new FormData()
      formData.append('image', file)

      // Call AI analysis API
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const analysis = result.analysis
        setAiSuggestions(analysis)
        
        // Auto-populate form fields
        setTitle(analysis.title || '')
        setCategory(analysis.category || categories[0])
        setDescription(analysis.description || '')
        
        // Set suggested starting bid if provided
        if (analysis.suggestedStartingBid) {
          const bidAmount = analysis.suggestedStartingBid.replace(/[^\d.]/g, '')
          setStartingBid(bidAmount)
        }
        
        setAnalysisComplete(true)
      } else {
        setAnalysisError(result.error || 'Failed to analyze image')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setAnalysisError('Failed to analyze image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleUploadClick = () => {
    dropRef.current.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  // Reset AI suggestions (allow user to start over)
  const resetAIAnalysis = async () => {
    if (image) {
      setIsAnalyzing(true)
      await handleImageUpload(image)
    }
  }

  // Form submission
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!image || !title || !startingBid || !startTime || !endTime) {
      setError("Please fill all required fields and add an image.")
      setSubmitting(false)
      return
    }

    try {
      // Here you would normally submit to your auction creation API
      // For now, just simulate success
      console.log('Submitting auction:', {
        title,
        category,
        description,
        startingBid,
        reservePrice,
        quantity,
        startTime,
        endTime,
        aiSuggestions
      })
      
      alert("Auction created successfully!")
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to create auction. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto mt-10 bg-[#18181B] text-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow"
    >
      {/* Left section: Image upload and AI analysis */}
      <div className="lg:col-span-2">
        {/* Image Upload Area */}
        <div className="mb-6">
          <label className="block font-bold mb-2">Upload Product Image</label>
          <p className="text-xs text-gray-400 mb-3">
            High-resolution images lead to better AI analysis and auction performance.
          </p>
          
          <div
            className={`bg-[#232326] rounded-lg flex flex-col items-center justify-center h-64 mb-4 border-2 border-dashed transition-colors cursor-pointer ${
              isAnalyzing 
                ? 'border-orange-400 bg-orange-400/10' 
                : 'border-orange-500 hover:border-orange-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              accept="image/*"
              ref={dropRef}
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center text-orange-400">
                <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mb-2"></div>
                <span className="text-sm">AI is analyzing your image...</span>
              </div>
            ) : preview ? (
              <img src={preview} alt="Preview" className="max-h-52 rounded" />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004-4h10a4 4 0 004 4M7 10V4m0 6l4-4m-4 4l-4-4" />
                </svg>
                <span>Drag & drop or <span className="text-orange-400 underline">browse</span></span>
                <span className="text-xs mt-1">AI will auto-generate title, category & description</span>
              </div>
            )}
          </div>

          {analysisError && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded mb-4">
              <p className="text-sm">{analysisError}</p>
              <button
                type="button"
                onClick={resetAIAnalysis}
                className="text-xs underline mt-1 hover:text-red-300"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* AI-Generated Fields */}
        <div className="bg-[#212126] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-orange-400 flex items-center gap-2">
              <svg width="22" height="22" className="inline" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M11 7v4l2.5 2.5"/>
              </svg>
              {analysisComplete ? 'AI Analysis Complete' : 'Item Details'}
            </h3>
            
            {analysisComplete && (
              <button
                type="button"
                onClick={resetAIAnalysis}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition"
              >
                Re-analyze
              </button>
            )}
          </div>

          {analysisComplete && aiSuggestions && (
            <div className="bg-green-900/20 border border-green-500 text-green-400 p-3 rounded mb-4">
              <p className="text-xs">
                ✅ AI detected: {aiSuggestions.condition} condition {aiSuggestions.category.toLowerCase()}
                {aiSuggestions.estimatedValue && ` • Estimated value: ${aiSuggestions.estimatedValue}`}
              </p>
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Listing Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                placeholder="AI will generate a compelling title..."
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                rows={6}
                placeholder="AI will generate a detailed, professional description..."
                required
              />
              <div className="text-xs text-gray-400 mt-1">
                {description.length}/300 characters
              </div>
            </div>

            {/* Show AI key features if available */}
            {aiSuggestions?.keyFeatures && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">AI-Detected Key Features</label>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.keyFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Pricing & timing */}
      <div className="space-y-6">
        <div className="bg-[#232326] rounded-lg p-4">
          <h3 className="font-bold mb-4">Pricing & Quantity</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Starting Bid (USD) *</label>
              <input
                type="number"
                min={1}
                step={1}
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                placeholder="AI will suggest a starting bid..."
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Reserve Price (Optional)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-[#232326] rounded-lg p-4">
          <h3 className="font-bold mb-4 text-orange-400">Auction Timing</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting || isAnalyzing}
        >
          {submitting ? "Creating Auction..." : "Create Auction"}
        </button>

        {error && (
          <div className="p-3 bg-red-900/40 text-red-400 text-sm rounded">
            {error}
          </div>
        )}

        {/* AI Analysis Summary */}
        {aiSuggestions && (
          <div className="bg-[#232326] rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-sm">AI Analysis Summary</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Estimated Value: {aiSuggestions.estimatedValue}</p>
              <p>• Condition: {aiSuggestions.condition}</p>
              <p>• Suggested Starting Bid: {aiSuggestions.suggestedStartingBid}</p>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
