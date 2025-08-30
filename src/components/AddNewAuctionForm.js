
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AddNewAuctionForm() {
  const router = useRouter()
  const dropRef = useRef(null)
  const cameraRef = useRef(null) // ✅ NEW: Camera input ref

  // Form state
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('') // S3 URL to store in database
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

  // ✅ NEW: Mobile detection state
  const [isMobile, setIsMobile] = useState(false)

  // ✅ NEW: Detect if device supports camera
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    checkMobile()
  }, [])

  // Set default times when component loads
  useEffect(() => {
    const now = new Date()
    const defaultStart = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
    const defaultEnd = new Date(defaultStart.getTime() + 24 * 60 * 60 * 1000) // 24 hours later
    
    const formatDateTime = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    
    if (!startTime) {
      setStartTime(formatDateTime(defaultStart))
    }
    if (!endTime) {
      setEndTime(formatDateTime(defaultEnd))
    }
  }, [])

  // ENHANCED IMAGE UPLOAD WITH BETTER ERROR HANDLING
  const handleImageUpload = async (file) => {
    if (!file) return

    // Validation: type, size, dimensions
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSizeMB = 5
    const minWidth = 400, minHeight = 400
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, WEBP, or GIF image.')
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image file must be less than ${maxSizeMB}MB.`)
      return
    }

    // Check image dimensions before accepting
    const img = new window.Image()
    img.src = URL.createObjectURL(file)
    img.onload = async () => {
      if (img.width < minWidth || img.height < minHeight) {
        setError(`Image must be at least ${minWidth}x${minHeight}px.`)
        URL.revokeObjectURL(img.src)
        return
      }
      URL.revokeObjectURL(img.src)
      
      // Passed validation!
      setError('')
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setAnalysisComplete(false)
      setAnalysisError('')
      setIsAnalyzing(true)

      try {
        console.log('🚀 Starting image upload and AI analysis...')

        // 1. Get pre-signed URL from S3 upload API
        console.log('📤 Getting presigned URL...')
        const presignedResponse = await fetch('/api/s3-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            fileName: file.name, 
            fileType: file.type 
          }),
        })

        if (!presignedResponse.ok) {
          const errorText = await presignedResponse.text()
          console.error('❌ Presigned URL error:', errorText)
          throw new Error(`Failed to get upload URL: ${errorText}`)
        }

        const { url, key, fileUrl } = await presignedResponse.json()

        if (!url || !fileUrl) {
          throw new Error('Invalid response from upload service')
        }

        console.log('📤 Uploading to S3:', { key, fileUrl })

        // 2. Upload image directly to S3
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload image to S3: ${uploadResponse.status} ${uploadResponse.statusText}`)
        }

        // Store the S3 URL for database storage
        setImageUrl(fileUrl)
        console.log('✅ Image uploaded successfully:', fileUrl)

        // 3. Call AI analysis with the uploaded image
        console.log('🤖 Starting AI analysis...')
        const analysisResponse = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imageKey: key, 
            imageUrl: fileUrl 
          }),
        })

        if (!analysisResponse.ok) {
          const errorText = await analysisResponse.text()
          console.error('❌ AI API Error Response:', errorText)
          throw new Error(`AI analysis failed: ${errorText}`)
        }

        const result = await analysisResponse.json()
        
        if (result.success && result.analysis) {
          const analysis = result.analysis
          console.log('🎯 AI Analysis complete:', analysis)
          
          setAiSuggestions(analysis)
          
          // Auto-fill form fields
          setTitle(analysis.title || '')
          setCategory(analysis.category && categories.includes(analysis.category) 
            ? analysis.category 
            : categories[0]
          )
          setDescription(analysis.description || '')
          
          if (analysis.suggestedStartingBid) {
            const bidAmount = analysis.suggestedStartingBid.replace(/[^\d.]/g, '')
            setStartingBid(bidAmount)
          }
          
          setAnalysisComplete(true)
        } else {
          setAnalysisError(result.error || 'Failed to analyze image')
        }

      } catch (err) {
        console.error('❌ Upload/Analysis error:', err)
        setAnalysisError(`Failed to process image: ${err.message || 'Please try again.'}`)
      } finally {
        setIsAnalyzing(false)
      }
    }
    
    img.onerror = () => {
      setError('Invalid image file. Please select a different file.')
      URL.revokeObjectURL(img.src)
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
  
  // ✅ NEW: Handle camera capture
  const handleCameraClick = () => {
    cameraRef.current.click()
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

  // ✅ NEW: Handle camera input change
  const handleCameraChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  // Reset AI suggestions
  const resetAIAnalysis = async () => {
    if (image) {
      setIsAnalyzing(true)
      await handleImageUpload(image)
    }
  }

  // ✅ FORM VALIDATION
  const validateForm = () => {
    if (!imageUrl) {
      throw new Error('Please upload an image first.')
    }
    if (!title.trim()) {
      throw new Error('Title is required.')
    }
    if (!description.trim()) {
      throw new Error('Description is required.')
    }
    if (!startingBid || parseFloat(startingBid) <= 0) {
      throw new Error('Starting bid must be a positive number.')
    }
    if (!startTime || !endTime) {
      throw new Error('Start and end times are required.')
    }
    
    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()
    
    if (isNaN(start.getTime())) {
      throw new Error('Please enter a valid start time.')
    }
    if (isNaN(end.getTime())) {
      throw new Error('Please enter a valid end time.')
    }
    
    const minStartTime = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes from now
    if (start < minStartTime) {
      throw new Error('Start time must be at least 5 minutes in the future.')
    }
    
    const minDuration = 60 * 60 * 1000 // 1 hour minimum
    if (end <= start) {
      throw new Error('End time must be after start time.')
    }
    if (end.getTime() - start.getTime() < minDuration) {
      throw new Error('Auction must run for at least 1 hour.')
    }
    
    const maxDuration = 30 * 24 * 60 * 60 * 1000 // 30 days
    if (end.getTime() - start.getTime() > maxDuration) {
      throw new Error('Auction cannot run for more than 30 days.')
    }
  }

  // ✅ NEW: Image compression function
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // FORM SUBMISSION WITH API INTEGRATION
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      console.log('🚀 Validating form...')
      validateForm()

      // ✅ Compress image before sending
      let imageToSend = image
      if (image && image.size > 1024 * 1024) { // If larger than 1MB
        console.log('📦 Compressing image...')
        imageToSend = await compressImage(image, 800, 0.7)
        console.log(`📦 Compressed from ${(image.size / 1024 / 1024).toFixed(2)}MB to ${(imageToSend.size / 1024 / 1024).toFixed(2)}MB`)
      }

      // Create FormData to send image file + auction data
      const formData = new FormData()
      
      // Add all the auction fields
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('startingPrice', parseFloat(startingBid))
      formData.append('endDate', new Date(endTime).toISOString())
      formData.append('category', category)
      
      // Add optional fields if they have values
      if (startTime) {
        formData.append('startDate', new Date(startTime).toISOString())
      }
      if (quantity) {
        formData.append('quantity', parseInt(quantity) || 1)
      }
      if (reservePrice) {
        formData.append('reservePrice', parseFloat(reservePrice))
      }
      
      // Add the compressed image file
      if (imageToSend) {
        formData.append('image', imageToSend, 'image.jpg')
      }

      console.log('📤 Creating auction with compressed FormData...')

      // ✅ Use auctionAPI instead of direct fetch to handle CORS
      const response = await auctionAPI.createAuctionWithImage(formData)
      
      console.log('✅ Auction created successfully:', response)

      alert('🎉 Auction created successfully!')
      
      // Redirect to auction details or dashboard
      const auctionId = response._id || response.id
      if (auctionId) {
        router.push(`/auctions/${auctionId}`)
      } else {
        router.push('/dashboard')
      }

    } catch (err) {
      console.error('❌ Form submission error:', err)
      setError(err.message || 'Failed to create auction. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto mt-10 bg-[#18181B] text-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow"
    >
      {/* LEFT: Image upload and AI analysis */}
      <div className="lg:col-span-2">
        {/* Error message for image upload */}
        {error && (
          <div className="mb-4 bg-red-800/20 border border-red-500 text-red-400 rounded p-3 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Image Upload Area */}
        <div className="mb-6">
          <label className="block font-bold mb-2">Upload Product Image</label>
          <p className="text-xs text-gray-400 mb-3">
            High-resolution images lead to better AI analysis and auction performance.
            <br />
            <span className="text-green-400">
              Accepted: JPG, PNG, WEBP, GIF | Max 5MB | Min 400x400px
            </span>
          </p>
          
          {/* ✅ NEW: Upload Options - Mobile vs Desktop */}
          {isMobile ? (
            /* Mobile Upload Options */
            <div className="space-y-4 mb-4">
              {/* Camera and Gallery Buttons for Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center gap-2 transition"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold">Take Photo</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg flex flex-col items-center gap-2 transition"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">Choose from Gallery</span>
                </button>
              </div>
              
              {/* Hidden file inputs for mobile */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraRef}
                style={{ display: "none" }}
                onChange={handleCameraChange}
              />
              <input
                type="file"
                accept="image/*"
                ref={dropRef}
                style={{ display: "none" }}
                onChange={handleInputChange}
              />
              
              {/* Mobile Preview Area */}
              {isAnalyzing ? (
                <div className="bg-[#232326] rounded-lg flex flex-col items-center justify-center h-48 border-2 border-orange-400">
                  <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mb-2"></div>
                  <span className="text-sm text-orange-400">AI is analyzing your image...</span>
                </div>
              ) : preview ? (
                <div className="bg-[#232326] rounded-lg p-4 text-center">
                  <img src={preview} alt="Preview" className="max-h-48 rounded mx-auto mb-2" />
                  <span className="text-xs text-green-400">✅ Image uploaded to S3</span>
                </div>
              ) : (
                <div className="bg-[#232326] rounded-lg border-2 border-dashed border-gray-500 p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Use buttons above to add image</p>
                  <p className="text-xs mt-1">AI will auto-generate title & description</p>
                </div>
              )}
            </div>
          ) : (
            /* Desktop Drag & Drop Area */
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
                <div className="flex flex-col items-center">
                  <img src={preview} alt="Preview" className="max-h-52 rounded mb-2" />
                  <span className="text-xs text-green-400">✅ Image uploaded to S3</span>
                </div>
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
          )}

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
                ✅ AI detected: {aiSuggestions.condition || 'Unknown'} condition {aiSuggestions.category?.toLowerCase() || 'item'}
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
                {description.length}/500 characters
              </div>
            </div>
            
            {aiSuggestions?.keyFeatures && aiSuggestions.keyFeatures.length > 0 && (
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

      {/* RIGHT: Pricing, quantity, timing */}
      <div className="space-y-6">
        <div className="bg-[#232326] rounded-lg p-4">
          <h3 className="font-bold mb-4">Pricing & Quantity</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Starting Bid (USD) *</label>
              <input
                type="number"
                min={1}
                step={0.01}
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
                step={0.01}
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                className="w-full bg-[#252529] rounded px-3 py-2 text-white"
                placeholder="Minimum selling price"
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
              <div className="text-xs text-gray-400 mt-1">
                Auction will start at this time
              </div>
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
              {startTime && endTime && (
                <div className="text-xs text-gray-400 mt-1">
                  Duration: {Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60))} hours
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting || isAnalyzing || !imageUrl}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Creating Auction...
            </span>
          ) : (
            'Create Auction'
          )}
        </button>

        {/* AI Analysis Summary */}
        {aiSuggestions && (
          <div className="bg-[#232326] rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-sm">AI Analysis Summary</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Estimated Value: {aiSuggestions.estimatedValue || 'Not determined'}</p>
              <p>• Condition: {aiSuggestions.condition || 'Not determined'}</p>
              <p>• Suggested Starting Bid: {aiSuggestions.suggestedStartingBid || 'Not determined'}</p>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
