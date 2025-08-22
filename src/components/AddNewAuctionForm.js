// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import S3DirectUploadForm from '@/components/S3DirectUploadForm'

// const categories = [
//   "Electronics",
//   "Art & Collectibles", 
//   "Jewelry & Watches",
//   "Antiques & Vintage",
//   "Fashion & Accessories",
//   "Home & Garden",
//   "Sports & Recreation",
//   "Books & Media",
//   "Toys & Games",
//   "Musical Instruments",
//   "Photography Equipment",
//   "Automotive Parts",
//   "Memorabilia",
//   "Furniture",
//   "Tools & Equipment"
// ]

// export default function AddNewAuctionForm() {
//   const router = useRouter()
//   const dropRef = useRef(null)

//   // Form state
//   const [image, setImage] = useState(null)
//   const [preview, setPreview] = useState(null)
//   const [title, setTitle] = useState('')
//   const [category, setCategory] = useState(categories[0])
//   const [description, setDescription] = useState('')
//   const [startingBid, setStartingBid] = useState('')
//   const [reservePrice, setReservePrice] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [startTime, setStartTime] = useState('')
//   const [endTime, setEndTime] = useState('')

//   // AI Analysis state
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [analysisComplete, setAnalysisComplete] = useState(false)
//   const [aiSuggestions, setAiSuggestions] = useState(null)
//   const [analysisError, setAnalysisError] = useState('')

//   // Form submission state
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState('')

//   // ENHANCED IMAGE UPLOAD HANDLER WITH S3 DIRECT UPLOAD
//   const handleImageUpload = async (file) => {
//     if (!file) return

//     // Validation: type, size, dimensions
//     const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
//     const maxSizeMB = 5
//     const minWidth = 400, minHeight = 400
    
//     if (!validTypes.includes(file.type)) {
//       setError('Please upload a JPG, PNG, WEBP, or GIF image.')
//       return
//     }
//     if (file.size > maxSizeMB * 1024 * 1024) {
//       setError(`Image file must be less than ${maxSizeMB}MB.`)
//       return
//     }

//     // Check image dimensions before accepting
//     const img = new window.Image()
//     img.src = URL.createObjectURL(file)
//     img.onload = async () => {
//       if (img.width < minWidth || img.height < minHeight) {
//         setError(`Image must be at least ${minWidth}x${minHeight}px.`)
//         URL.revokeObjectURL(img.src)
//         return
//       }
//       URL.revokeObjectURL(img.src)
//       // Passed validation!
//       setError('')
//       setImage(file)
//       setPreview(URL.createObjectURL(file))
//       setAnalysisComplete(false)
//       setAnalysisError('')
//       setIsAnalyzing(true)

//       try {
//         // 1. Get pre-signed URL from S3 upload API
//         const presignedResponse = await fetch('/api/s3-upload', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ fileName: file.name, fileType: file.type }),
//         })

//         if (!presignedResponse.ok) {
//           throw new Error('Failed to get upload URL')
//         }

//         const { url, key, fileUrl } = await presignedResponse.json()

//         if (!url) {
//           throw new Error('Failed to get pre-signed URL')
//         }

//         // 2. Upload image directly to S3
//         const uploadResponse = await fetch(url, {
//           method: 'PUT',
//           body: file,
//           headers: {
//             'Content-Type': file.type,
//           },
//         })

//         if (!uploadResponse.ok) {
//           throw new Error('Failed to upload image to S3')
//         }

//         // 3. Call analysis API with the S3 key
//         const response = await fetch('/api/analyze-image', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ imageKey: key, imageUrl: fileUrl }),
//         })

//         const result = await response.json()
//         if (result.success) {
//           const analysis = result.analysis
//           setAiSuggestions(analysis)
//           setTitle(analysis.title || '')
//           setCategory(analysis.category || categories[0])
//           setDescription(analysis.description || '')
//           if (analysis.suggestedStartingBid) {
//             const bidAmount = analysis.suggestedStartingBid.replace(/[^\d.]/g, '')
//             setStartingBid(bidAmount)
//           }
//           setAnalysisComplete(true)
//         } else {
//           setAnalysisError(result.error || 'Failed to analyze image')
//         }
//       } catch (err) {
//         console.error('Analysis error:', err)
//         setAnalysisError(`Failed to analyze image: ${err.message || 'Please try again.'}`)
//       } finally {
//         setIsAnalyzing(false)
//       }
//     }
//     img.onerror = () => {
//       setError('Invalid image file. Please select a different file.')
//       URL.revokeObjectURL(img.src)
//     }
//   }

//   // Drag and drop handlers
//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     const file = e.dataTransfer.files[0]
//     if (file && file.type.startsWith('image/')) {
//       handleImageUpload(file)
//     }
//   }
//   const handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }
//   const handleUploadClick = () => {
//     dropRef.current.click()
//   }
//   const handleInputChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       handleImageUpload(file)
//     }
//   }

//   // Reset AI suggestions
//   const resetAIAnalysis = async () => {
//     if (image) {
//       setIsAnalyzing(true)
//       await handleImageUpload(image)
//     }
//   }

//   // Form submission
//   async function handleSubmit(e) {
//     e.preventDefault()
//     setSubmitting(true)
//     setError('')

//     if (!image || !title || !startingBid || !startTime || !endTime) {
//       setError("Please fill all required fields and add an image.")
//       setSubmitting(false)
//       return
//     }

//     try {
//       // Submit to your auction API here
//       console.log('Submitting auction:', {
//         title,
//         category,
//         description,
//         startingBid,
//         reservePrice,
//         quantity,
//         startTime,
//         endTime,
//         aiSuggestions
//       })
//       alert("Auction created successfully!")
//       router.push('/dashboard')
//     } catch (err) {
//       setError('Failed to create auction. Please try again.')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview)
//     }
//   }, [preview])

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-6xl mx-auto mt-10 bg-[#18181B] text-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow"
//     >
//       {/* LEFT: Image upload and AI analysis */}
//       <div className="lg:col-span-2">
//         {/* Error message for image upload */}
//         {error && (
//           <div className="mb-4 bg-red-800/20 border border-red-500 text-red-400 rounded p-3 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Image Upload Area */}
//         <div className="mb-6">
//           <label className="block font-bold mb-2">Upload Product Image</label>
//           <p className="text-xs text-gray-400 mb-3">
//             High-resolution images lead to better AI analysis and auction performance.
//             <br />
//             <span className="text-green-400">
//               Accepted: JPG, PNG, WEBP, GIF | Max 5MB | Min 400x400px
//             </span>
//           </p>
//           <div
//             className={`bg-[#232326] rounded-lg flex flex-col items-center justify-center h-64 mb-4 border-2 border-dashed transition-colors cursor-pointer ${
//               isAnalyzing
//                 ? 'border-orange-400 bg-orange-400/10'
//                 : 'border-orange-500 hover:border-orange-400'
//             }`}
//             onDrop={handleDrop}
//             onDragOver={handleDrag}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onClick={handleUploadClick}
//           >
//             <input
//               type="file"
//               accept="image/*"
//               ref={dropRef}
//               style={{ display: "none" }}
//               onChange={handleInputChange}
//             />
//             {isAnalyzing ? (
//               <div className="flex flex-col items-center text-orange-400">
//                 <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mb-2"></div>
//                 <span className="text-sm">AI is analyzing your image...</span>
//               </div>
//             ) : preview ? (
//               <img src={preview} alt="Preview" className="max-h-52 rounded" />
//             ) : (
//               <div className="flex flex-col items-center text-gray-500">
//                 <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004-4h10a4 4 0 004 4M7 10V4m0 6l4-4m-4 4l-4-4" />
//                 </svg>
//                 <span>Drag & drop or <span className="text-orange-400 underline">browse</span></span>
//                 <span className="text-xs mt-1">AI will auto-generate title, category & description</span>
//               </div>
              
//               )}
//               </div>
//               {/* <S3DirectUploadForm />  */}

//           {analysisError && (
//             <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded mb-4">
//               <p className="text-sm">{analysisError}</p>
//               <button
//                 type="button"
//                 onClick={resetAIAnalysis}
//                 className="text-xs underline mt-1 hover:text-red-300"
//               >
//                 Try again
//               </button>
//             </div>
//           )}
//         </div>
                


//         {/* AI-Generated Fields */}
//         <div className="bg-[#212126] rounded-lg p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-bold text-orange-400 flex items-center gap-2">
//               <svg width="22" height="22" className="inline" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <circle cx="11" cy="11" r="8"/>
//                 <path d="M11 7v4l2.5 2.5"/>
//               </svg>
//               {analysisComplete ? 'AI Analysis Complete' : 'Item Details'}
//             </h3>
//             {analysisComplete && (
//               <button
//                 type="button"
//                 onClick={resetAIAnalysis}
//                 className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition"
//               >
//                 Re-analyze
//               </button>
//             )}
//           </div>
//           {analysisComplete && aiSuggestions && (
//             <div className="bg-green-900/20 border border-green-500 text-green-400 p-3 rounded mb-4">
//               <p className="text-xs">
//                 ✅ AI detected: {aiSuggestions.condition} condition {aiSuggestions.category.toLowerCase()}
//                 {aiSuggestions.estimatedValue && ` • Estimated value: ${aiSuggestions.estimatedValue}`}
//               </p>
//             </div>
//           )}
//           <div className="grid gap-4">
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Listing Title *</label>
//               <input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 placeholder="AI will generate a compelling title..."
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Category *</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 required
//               >
//                 {categories.map(cat => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Description *</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 rows={6}
//                 placeholder="AI will generate a detailed, professional description..."
//                 required
//               />
//               <div className="text-xs text-gray-400 mt-1">
//                 {description.length}/300 characters
//               </div>
//             </div>
//             {aiSuggestions?.keyFeatures && (
//               <div>
//                 <label className="text-xs text-gray-400 block mb-1">AI-Detected Key Features</label>
//                 <div className="flex flex-wrap gap-2">
//                   {aiSuggestions.keyFeatures.map((feature, index) => (
//                     <span
//                       key={index}
//                       className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs"
//                     >
//                       {feature}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT: Pricing, quantity, timing */}
//       <div className="space-y-6">
//         <div className="bg-[#232326] rounded-lg p-4">
//           <h3 className="font-bold mb-4">Pricing & Quantity</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Starting Bid (USD) *</label>
//               <input
//                 type="number"
//                 min={1}
//                 step={1}
//                 value={startingBid}
//                 onChange={(e) => setStartingBid(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 placeholder="AI will suggest a starting bid..."
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Reserve Price (Optional)</label>
//               <input
//                 type="number"
//                 min={0}
//                 step={1}
//                 value={reservePrice}
//                 onChange={(e) => setReservePrice(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Quantity</label>
//               <input
//                 type="number"
//                 min={1}
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <div className="bg-[#232326] rounded-lg p-4">
//           <h3 className="font-bold mb-4 text-orange-400">Auction Timing</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Start Time *</label>
//               <input
//                 type="datetime-local"
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">End Time *</label>
//               <input
//                 type="datetime-local"
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//                 className="w-full bg-[#252529] rounded px-3 py-2 text-white"
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full py-3 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={submitting || isAnalyzing}
//         >
//           {submitting ? "Creating Auction..." : "Create Auction"}
//         </button>
//         {/* Extra error (server/AI) */}
//         {error && (
//           <div className="p-3 bg-red-900/40 text-red-400 text-sm rounded">
//             {error}
//           </div>
//         )}
//         {/* AI Analysis Summary */}
//         {aiSuggestions && (
//           <div className="bg-[#232326] rounded-lg p-4">
//             <h4 className="font-semibold mb-2 text-sm">AI Analysis Summary</h4>
//             <div className="text-xs text-gray-400 space-y-1">
//               <p>• Estimated Value: {aiSuggestions.estimatedValue}</p>
//               <p>• Condition: {aiSuggestions.condition}</p>
//               <p>• Suggested Starting Bid: {aiSuggestions.suggestedStartingBid}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </form>
//   )
// }

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

  // ✅ ENHANCED IMAGE UPLOAD WITH S3 AND AI INTEGRATION
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
          throw new Error('Failed to get upload URL')
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
          throw new Error('Failed to upload image to S3')
        }

        // ✅ Store the S3 URL for database storage
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
  
  const handleUploadClick = () => {
    dropRef.current.click()
  }
  
  const handleInputChange = (e) => {
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
    
    if (start <= now) {
      throw new Error('Start time must be in the future.')
    }
    if (end <= start) {
      throw new Error('End time must be after start time.')
    }
  }

  // ✅ FORM SUBMISSION WITH API INTEGRATION
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      console.log('🚀 Validating form...')
      validateForm()

      // ✅ Prepare auction data for API
      const auctionData = {
        title: title.trim(),
        description: description.trim(),
        startingPrice: parseFloat(startingBid),
        endDate: new Date(endTime).toISOString(),
        category: category,
        images: [imageUrl], // Store S3 URL in images array
        // Optional fields based on your API
        startDate: new Date(startTime).toISOString(),
        quantity: parseInt(quantity) || 1,
        reservePrice: reservePrice ? parseFloat(reservePrice) : undefined,
        // AI metadata (optional, for analytics)
        aiAnalysis: aiSuggestions ? {
          estimatedValue: aiSuggestions.estimatedValue,
          condition: aiSuggestions.condition,
          keyFeatures: aiSuggestions.keyFeatures
        } : undefined
      }

      // Remove undefined fields
      Object.keys(auctionData).forEach(key => {
        if (auctionData[key] === undefined) {
          delete auctionData[key]
        }
      })

      console.log('📤 Creating auction with data:', auctionData)

      // ✅ Call your auction API
      const response = await auctionAPI.createAuction(auctionData)
      
      console.log('✅ Auction created successfully:', response)

      // ✅ Success - redirect to the new auction or dashboard
      alert('🎉 Auction created successfully!')
      
      // Redirect to the new auction detail page or dashboard
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
