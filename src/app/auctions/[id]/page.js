// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import Link from 'next/link'
// import Navbar from '../../../components/Navbar'
// import Footer from '../../../components/Footer'

// // ✅ NEW: API Integration Functions
// const API_BASE_URL = 'https://excellwebsolution.com'

// // Get single auction by ID
// const getAuctionById = async (id) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/auctions/${id}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
    
//     const auction = await response.json()
//     return auction
//   } catch (error) {
//     console.error('Error fetching auction:', error)
//     return null
//   }
// }

// // Get bids for auction
// const getBidsForAuction = async (auctionId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/bids/${auctionId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
    
//     const bids = await response.json()
//     return bids
//   } catch (error) {
//     console.error('Error fetching bids:', error)
//     return []
//   }
// }

// // Place a bid
// const placeBid = async (auctionId, bidAmount, token) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/bids`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         auctionId,
//         bidAmount
//       }),
//     })
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
    
//     const bid = await response.json()
//     return bid
//   } catch (error) {
//     console.error('Error placing bid:', error)
//     throw error
//   }
// }

// // Generate AI analysis
// const generateAIAnalysis = async (prompt, token) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({ prompt }),
//     })
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
    
//     const result = await response.json()
//     return result
//   } catch (error) {
//     console.error('Error generating AI analysis:', error)
//     return null
//   }
// }

// // ✅ FALLBACK: Static auction data when API fails
// const getStaticAuctionData = (id) => {
//   return {
//     _id: id,
//     title: "Vintage Rolex Datejust Third Hand",
//     description: "This exceptional 1971 Rolex Datejust represents the pinnacle of Swiss watchmaking excellence. The 36mm stainless steel case houses the legendary automatic movement, ensuring precision that has made Rolex the world's most trusted timepiece. The champagne dial features applied hour markers and the iconic date window at 3 o'clock with Cyclops magnification.",
//     images: ["/assets/PB-3.jpg"],
//     imageUrl: "/assets/PB-3.jpg",
//     startingPrice: 1000,
//     currentBid: 2550,
//     reservePrice: 3000,
//     reserveMet: false,
//     endDate: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
//     condition: "Excellent",
//     category: "Watches",
//     seller: {
//       name: "LuxuryTimepieces",
//       rating: 4.9,
//       totalSales: 234,
//       joinedDate: "2019",
//       verified: true,
//       location: "New York, NY"
//     },
//     shipping: {
//       cost: 25,
//       international: true
//     },
//     specifications: {
//       "Brand": "Rolex",
//       "Model": "Datejust", 
//       "Year": "1971",
//       "Case Size": "36mm",
//       "Movement": "Automatic"
//     }
//   }
// }

// // ✅ NEW: AI Similar Items Component with API Integration
// function AISimilarItems({ auction }) {
//   const [similarItems, setSimilarItems] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchSimilarItems = async () => {
//       setLoading(true)
      
//       // Try AI API first
//       const token = localStorage.getItem('token')
//       if (token) {
//         const aiResult = await generateAIAnalysis(
//           `Find similar items to: ${auction.title} - ${auction.category}`,
//           token
//         )
        
//         if (aiResult) {
//           // Parse AI response and create similar items (mock implementation)
//           const mockSimilarItems = [
//             {
//               id: 1,
//               title: "1970 Rolex Datejust 36mm",
//               price: "$2,800",
//               source: "Christie's",
//               image: auction.imageUrl || auction.images?.[0] || "/assets/PB-3.jpg",
//               condition: "Very Good",
//               similarity: 95
//             },
//             {
//               id: 2,
//               title: "Vintage Rolex Datejust Steel",
//               price: "$2,200",
//               source: "Sotheby's",
//               image: auction.imageUrl || auction.images?.[0] || "/assets/PB-4.jpg",
//               condition: "Excellent", 
//               similarity: 92
//             }
//           ]
//           setSimilarItems(mockSimilarItems)
//         }
//       }
      
//       // Fallback to mock data if AI fails
//       if (similarItems.length === 0) {
//         setTimeout(() => {
//           setSimilarItems([
//             {
//               id: 1,
//               title: "Similar " + auction.category + " Item",
//               price: "$" + (auction.currentBid || auction.startingPrice + 200),
//               source: "Market Data",
//               image: auction.imageUrl || auction.images?.[0] || "/assets/PB-3.jpg",
//               condition: "Excellent",
//               similarity: 90
//             }
//           ])
//           setLoading(false)
//         }, 2000)
//       } else {
//         setLoading(false)
//       }
//     }

//     fetchSimilarItems()
//   }, [auction])

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//       <div className="flex items-center gap-2 mb-3 sm:mb-4">
//         <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs font-bold">AI</span>
//         </div>
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold">Similar Items</h3>
//       </div>

//       {loading ? (
//         <div className="space-y-2 sm:space-y-3">
//           {[1, 2].map(i => (
//             <div key={i} className="animate-pulse">
//               <div className="flex gap-2 sm:gap-3">
//                 <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-700 rounded-lg"></div>
//                 <div className="flex-1 space-y-1 sm:space-y-2">
//                   <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4"></div>
//                   <div className="h-2 sm:h-3 bg-gray-700 rounded w-1/2"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-2 sm:space-y-3">
//           {similarItems.map((item) => (
//             <div key={item.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#232326] rounded-lg hover:bg-[#2a2a2e] transition-colors">
//               <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h4 className="font-medium text-white text-xs sm:text-sm truncate">{item.title}</h4>
//                 <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400 mt-1">
//                   <span className="text-green-400 font-semibold">{item.price}</span>
//                   <span className="hidden sm:inline">•</span>
//                   <span className="text-xs">{item.source}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
//         <div className="flex items-start gap-2">
//           <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <p className="text-purple-300 text-xs font-medium">AI Analysis</p>
//             <p className="text-gray-300 text-xs mt-1 leading-tight">
//               Competitive pricing detected based on recent market data.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ✅ NEW: AI Authenticity Check Component
// function AIAuthenticityCheck({ auction }) {
//   const [verificationData, setVerificationData] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const analyzeAuthenticity = async () => {
//       setLoading(true)
      
//       // Try AI API first
//       const token = localStorage.getItem('token')
//       if (token) {
//         const aiResult = await generateAIAnalysis(
//           `Analyze authenticity of: ${auction.title} - ${auction.description.substring(0, 200)}`,
//           token
//         )
        
//         if (aiResult) {
//           // Mock processing AI result
//           const mockVerification = {
//             overallScore: 92,
//             confidence: "High",
//             indicators: [
//               { 
//                 feature: "Brand Verification", 
//                 status: "authentic", 
//                 confidence: 95,
//                 details: "Consistent with known specifications"
//               },
//               { 
//                 feature: "Condition Assessment", 
//                 status: "authentic", 
//                 confidence: 88,
//                 details: "Matches described condition"
//               }
//             ]
//           }
//           setVerificationData(mockVerification)
//         }
//       }
      
//       // Fallback to mock data
//       if (!verificationData) {
//         setTimeout(() => {
//           setVerificationData({
//             overallScore: 88,
//             confidence: "High",
//             indicators: [
//               { 
//                 feature: "Visual Inspection", 
//                 status: "authentic", 
//                 confidence: 90,
//                 details: "No obvious red flags detected"
//               }
//             ]
//           })
//           setLoading(false)
//         }, 3000)
//       } else {
//         setLoading(false)
//       }
//     }

//     analyzeAuthenticity()
//   }, [auction])

//   if (loading) {
//     return (
//       <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//         <div className="flex items-center gap-2 mb-3 sm:mb-4">
//           <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
//             <span className="text-white text-xs font-bold">AI</span>
//           </div>
//           <h3 className="text-base sm:text-lg lg:text-xl font-bold">Authenticity Check</h3>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
//           <span className="text-blue-400 text-xs sm:text-sm">Analyzing...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//       <div className="flex items-center gap-2 mb-3 sm:mb-4">
//         <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs font-bold">AI</span>
//         </div>
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold">Authenticity Check</h3>
//       </div>

//       {/* Overall Score */}
//       <div className="mb-4 sm:mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-gray-300 text-xs sm:text-sm font-medium">Authenticity Score</span>
//           <span className={`font-bold text-base sm:text-lg ${
//             verificationData.overallScore >= 90 ? 'text-green-400' :
//             verificationData.overallScore >= 80 ? 'text-yellow-400' : 'text-red-400'
//           }`}>
//             {verificationData.overallScore}/100
//           </span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
//           <div 
//             className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ${
//               verificationData.overallScore >= 90 ? 'bg-green-400' :
//               verificationData.overallScore >= 80 ? 'bg-yellow-400' : 'bg-red-400'
//             }`}
//             style={{ width: `${verificationData.overallScore}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* Verification Indicators */}
//       <div className="space-y-2 sm:space-y-3">
//         {verificationData.indicators.map((indicator, index) => (
//           <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-[#232326] rounded-lg">
//             <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
//               indicator.status === 'authentic' ? 'bg-green-400' : 'bg-yellow-400'
//             }`}></div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-white text-xs sm:text-sm font-medium">{indicator.feature}</span>
//                 <span className="text-xs text-gray-400">{indicator.confidence}%</span>
//               </div>
//               <p className="text-xs text-gray-400 leading-tight">{indicator.details}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ✅ ENHANCED: Mobile-Optimized Countdown Timer
// function CountdownTimer({ endTime }) {
//   const [timeLeft, setTimeLeft] = useState('')
//   const [isUrgent, setIsUrgent] = useState(false)

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const difference = new Date(endTime) - new Date()
      
//       if (difference > 0) {
//         const hours = Math.floor(difference / (1000 * 60 * 60))
//         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
//         const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
//         if (hours > 0) {
//           setTimeLeft(`${hours}h ${minutes}m`)
//           setIsUrgent(hours < 1)
//         } else if (minutes > 0) {
//           setTimeLeft(`${minutes}m ${seconds}s`)
//           setIsUrgent(minutes < 30)
//         } else {
//           setTimeLeft(`${seconds}s`)
//           setIsUrgent(true)
//         }
//       } else {
//         setTimeLeft('ENDED')
//       }
//     }

//     calculateTimeLeft()
//     const timer = setInterval(calculateTimeLeft, 1000)
//     return () => clearInterval(timer)
//   }, [endTime])

//   return (
//     <div className={`text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl border-2 ${
//       timeLeft === 'ENDED' ? 'border-gray-500 bg-gray-900' :
//       isUrgent ? 'border-red-500 bg-red-900/20 animate-pulse' : 
//       'border-orange-500 bg-orange-900/20'
//     }`}>
//       <div className="text-xs text-gray-400 mb-1 sm:mb-2">Time Remaining</div>
//       <div className={`text-lg sm:text-2xl lg:text-3xl font-bold ${
//         timeLeft === 'ENDED' ? 'text-gray-400' :
//         isUrgent ? 'text-red-400' : 'text-orange-400'
//       }`}>
//         {timeLeft}
//       </div>
//     </div>
//   )
// }

// // ✅ ENHANCED: Mobile-Optimized Bid Form with API Integration
// function BidForm({ auction, onBidSubmit, bids }) {
//   const [bidAmount, setBidAmount] = useState('')
//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const currentBid = bids.length > 0 
//     ? Math.max(...bids.map(bid => bid.bidAmount))
//     : auction.startingPrice

//   const minBid = currentBid + 25

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     const numAmount = parseFloat(bidAmount)
//     if (!bidAmount || isNaN(numAmount) || numAmount < minBid) {
//       setErrors({ bidAmount: `Minimum bid is $${minBid.toLocaleString()}` })
//       return
//     }

//     setIsSubmitting(true)
//     setErrors({})
    
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         throw new Error('Please login to place bids')
//       }

//       await placeBid(auction._id, numAmount, token)
//       onBidSubmit({ amount: numAmount })
//       setBidAmount('')
      
//     } catch (error) {
//       setErrors({ submit: error.message || 'Failed to place bid' })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//       <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4">Place Your Bid</h3>
      
//       {/* Current Status - Mobile Optimized */}
//       <div className="bg-[#232326] rounded-lg p-3 mb-3 sm:mb-4">
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400 text-xs sm:text-sm">Current Bid</span>
//             <span className="text-base sm:text-xl font-bold text-orange-400">
//               ${currentBid.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400 text-xs sm:text-sm">Minimum Bid</span>
//             <span className="text-sm sm:text-base font-semibold text-white">
//               ${minBid.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//         {/* Bid Amount Input - Mobile Optimized */}
//         <div>
//           <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
//             Your Bid Amount (USD)
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">$</span>
//             <input
//               type="number"
//               value={bidAmount}
//               onChange={(e) => setBidAmount(e.target.value)}
//               className={`w-full bg-[#232326] border rounded-lg pl-8 pr-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-orange-500 text-sm sm:text-base ${
//                 errors.bidAmount ? 'border-red-500' : 'border-[#333]'
//               }`}
//               placeholder={minBid.toLocaleString()}
//               min={minBid}
//             />
//           </div>
//           {errors.bidAmount && (
//             <p className="text-red-400 text-xs mt-1">{errors.bidAmount}</p>
//           )}
//         </div>

//         {/* Submit Button - Mobile Optimized */}
//         <button
//           type="submit"
//           disabled={isSubmitting || !bidAmount}
//           className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition text-sm sm:text-base"
//         >
//           {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
//         </button>

//         {errors.submit && (
//           <p className="text-red-400 text-xs sm:text-sm text-center">{errors.submit}</p>
//         )}
//       </form>
//     </div>
//   )
// }

// // ✅ ENHANCED: Mobile-Optimized Image Component
// function ImageDisplay({ auction }) {
//   const imageUrl = auction.imageUrl || auction.images?.[0] || '/placeholder-auction.jpg'

//   return (
//     <div className="relative aspect-square bg-[#232326] rounded-lg sm:rounded-xl overflow-hidden">
//       <img
//         src={imageUrl}
//         alt={auction.title}
//         className="w-full h-full object-cover"
//         loading="lazy"
//       />
//       <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs sm:text-sm">
//         1 / 1
//       </div>
//     </div>
//   )
// }

// // ✅ ENHANCED: Mobile-Optimized Bid History
// function BidHistory({ bids, loading }) {
//   const [showAll, setShowAll] = useState(false)
//   const displayBids = showAll ? bids : bids.slice(0, 3)

//   if (loading) {
//     return (
//       <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4">Bid History</h3>
//         <div className="space-y-2 sm:space-y-3">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="animate-pulse">
//               <div className="h-10 bg-gray-700 rounded"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//       <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4">
//         Bid History ({bids.length})
//       </h3>
      
//       {bids.length === 0 ? (
//         <p className="text-gray-400 text-xs sm:text-sm text-center py-4">No bids yet</p>
//       ) : (
//         <>
//           <div className="space-y-2 sm:space-y-3">
//             {displayBids.map((bid, index) => (
//               <div key={bid._id || index} className="flex items-center justify-between py-2 border-b border-[#232326] last:border-b-0">
//                 <div className="flex items-center gap-2 flex-1 min-w-0">
//                   <div className={`w-2 h-2 rounded-full flex-shrink-0 ${index === 0 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
//                   <span className="text-gray-300 text-xs sm:text-sm truncate">
//                     Bidder {bid.userId?.substring(0, 6) || 'Anonymous'}
//                   </span>
//                   {index === 0 && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Winning</span>}
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <div className="font-semibold text-white text-xs sm:text-sm">${bid.bidAmount.toLocaleString()}</div>
//                   <div className="text-xs text-gray-400">
//                     {new Date(bid.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {bids.length > 3 && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="w-full mt-3 text-orange-400 hover:text-orange-300 text-xs sm:text-sm font-medium transition"
//             >
//               {showAll ? 'Show Less' : `Show All ${bids.length} Bids`}
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

// // ✅ MAIN: Enhanced Component with Full API Integration
// export default function AuctionDetailPage() {
//   const params = useParams()
//   const [auction, setAuction] = useState(null)
//   const [bids, setBids] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [bidsLoading, setBidsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [showBidSuccess, setShowBidSuccess] = useState(false)

//   // ✅ NEW: Fetch auction and bids from API
//   useEffect(() => {
//     const fetchAuctionData = async () => {
//       setLoading(true)
//       setError(null)
      
//       try {
//         // Try to fetch from API first
//         const auctionData = await getAuctionById(params.id)
        
//         if (auctionData) {
//           setAuction(auctionData)
          
//           // Fetch bids for this auction
//           setBidsLoading(true)
//           const bidsData = await getBidsForAuction(auctionData._id)
//           setBids(Array.isArray(bidsData) ? bidsData.sort((a, b) => b.bidAmount - a.bidAmount) : [])
//           setBidsLoading(false)
          
//         } else {
//           // Fallback to static data if API fails
//           console.log('API failed, using static data')
//           const staticData = getStaticAuctionData(params.id)
//           setAuction(staticData)
//           setBids([]) // No bids for static data
//           setBidsLoading(false)
//         }
        
//       } catch (err) {
//         console.error('Error fetching auction:', err)
//         setError('Failed to load auction data')
        
//         // Fallback to static data
//         const staticData = getStaticAuctionData(params.id)
//         setAuction(staticData)
//         setBids([])
//         setBidsLoading(false)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (params.id) {
//       fetchAuctionData()
//     }
//   }, [params.id])

//   const handleBidSubmit = async (bidData) => {
//     setShowBidSuccess(true)
//     setTimeout(() => setShowBidSuccess(false), 5000)
    
//     // Refresh bids after successful bid
//     try {
//       const updatedBids = await getBidsForAuction(auction._id)
//       setBids(Array.isArray(updatedBids) ? updatedBids.sort((a, b) => b.bidAmount - a.bidAmount) : [])
//     } catch (error) {
//       console.error('Error refreshing bids:', error)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#09090B] text-white">
//         <Navbar />
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !auction) {
//     return (
//       <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4">
//         <div className="text-center">
//           <h1 className="text-xl sm:text-2xl font-bold mb-4">
//             {error || 'Auction Not Found'}
//           </h1>
//           <Link href="/auctions" className="text-orange-400 hover:text-orange-300">
//             ← Back to Auctions
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#09090B] text-white">
//       <Navbar />

//       {/* Bid Success Notification */}
//       {showBidSuccess && (
//         <div className="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto sm:w-auto bg-green-600 text-white p-3 sm:p-4 rounded-lg shadow-lg z-50">
//           <div className="flex items-center gap-2">
//             <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm sm:text-base">Bid placed successfully!</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Breadcrumb - Mobile Optimized */}
//         <nav className="mb-3 sm:mb-4 lg:mb-6">
//           <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400 overflow-x-auto">
//             <Link href="/" className="hover:text-orange-400 whitespace-nowrap">Home</Link>
//             <span>/</span>
//             <Link href="/auctions" className="hover:text-orange-400 whitespace-nowrap">Auctions</Link>
//             <span>/</span>
//             <span className="text-white truncate">{auction.title}</span>
//           </div>
//         </nav>

//         {/* ✅ RESPONSIVE: Enhanced Mobile-First Layout */}
//         <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0">
          
//           {/* Left Column - Image and Description */}
//           <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//             {/* Image */}
//             <ImageDisplay auction={auction} />

//             {/* Description - Mobile Optimized */}
//             <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#232326]">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">{auction.title}</h2>
//               <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-4 sm:line-clamp-none">
//                 {auction.description}
//               </p>

//               {/* Specifications - Mobile Optimized */}
//               {auction.specifications && (
//                 <div className="mt-4 sm:mt-6">
//                   <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3">Specifications</h3>
//                   <div className="space-y-2">
//                     {Object.entries(auction.specifications).map(([key, value]) => (
//                       <div key={key} className="flex justify-between py-1 sm:py-2 border-b border-[#232326] text-xs sm:text-sm">
//                         <span className="text-gray-400">{key}</span>
//                         <span className="text-white font-medium">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Middle Column - Bidding */}
//           <div className="space-y-4 sm:space-y-6">
//             <CountdownTimer endTime={auction.endDate} />
//             <BidForm auction={auction} onBidSubmit={handleBidSubmit} bids={bids} />
//             <BidHistory bids={bids} loading={bidsLoading} />
//           </div>

//           {/* Right Column - AI Features */}
//           <div className="space-y-4 sm:space-y-6">
//             <AIAuthenticityCheck auction={auction} />
//             <AISimilarItems auction={auction} />
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

// Mock auction data (replace with real API call)
const getAuctionById = (id) => {
  const mockAuction = {
    id: parseInt(id),
    title: "Vintage Rolex Datejust Third Hand",
    description: "This exceptional 1971 Rolex Datejust represents the pinnacle of Swiss watchmaking excellence. The 36mm stainless steel case houses the legendary automatic movement, ensuring precision that has made Rolex the world's most trusted timepiece. The champagne dial features applied hour markers and the iconic date window at 3 o'clock with Cyclops magnification. The Jubilee bracelet shows minimal wear, indicating careful ownership. This piece comes with original box, papers, and full service history. A true collector's item that combines timeless elegance with investment potential.",
    images: [
      "/assets/PB-3.jpg",
      "/assets/PB-4.jpg", 
      "/assets/PB-3.jpg",
      "/assets/PB-4.jpg"
    ],
    currentBid: 2550,
    startingBid: 1000,
    reservePrice: 3000,
    reserveMet: false,
    bids: 45,
    seller: {
      name: "LuxuryTimepieces",
      rating: 4.9,
      totalSales: 234,
      joinedDate: "2019",
      verified: true,
      location: "New York, NY"
    },
    endTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000),
    condition: "Excellent",
    category: "Watches",
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    shipping: {
      cost: 25,
      methods: ["Standard", "Express", "Overnight"],
      international: true
    },
    specifications: {
      "Brand": "Rolex",
      "Model": "Datejust",
      "Year": "1971",
      "Case Size": "36mm",
      "Case Material": "Stainless Steel",
      "Movement": "Automatic",
      "Water Resistance": "100m",
      "Bracelet": "Jubilee",
      "Papers": "Yes",
      "Box": "Yes"
    },
    bidHistory: [
      { bidder: "Collector123", amount: 2550, time: "2 minutes ago", isWinning: true },
      { bidder: "WatchLover88", amount: 2500, time: "15 minutes ago", isWinning: false },
      { bidder: "TimeKeeper", amount: 2450, time: "32 minutes ago", isWinning: false },
      { bidder: "Collector123", amount: 2400, time: "1 hour ago", isWinning: false },
      { bidder: "VintageExpert", amount: 2350, time: "2 hours ago", isWinning: false }
    ]
  }
  return mockAuction
}

// ✅ NEW: AI Similar Items Component
function AISimilarItems({ auction }) {
  const [similarItems, setSimilarItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI API call to find similar items
    const fetchSimilarItems = async () => {
      setLoading(true)
      
      // Mock similar items data (replace with real AI API call)
      const mockSimilarItems = [
        {
          id: 1,
          title: "1970 Rolex Datejust 36mm",
          price: "$2,800",
          source: "Christie's",
          image: "/assets/PB-3.jpg",
          condition: "Very Good",
          similarity: 95
        },
        {
          id: 2,
          title: "Vintage Rolex Datejust Steel",
          price: "$2,200",
          source: "Sotheby's",
          image: "/assets/PB-4.jpg",
          condition: "Excellent",
          similarity: 92
        },
        {
          id: 3,
          title: "1971 Rolex Datejust Automatic",
          price: "$3,100",
          source: "Bonhams",
          image: "/assets/PB-3.jpg",
          condition: "Mint",
          similarity: 90
        },
        {
          id: 4,
          title: "Rolex Datejust Jubilee Bracelet",
          price: "$2,650",
          source: "Phillips",
          image: "/assets/PB-4.jpg",
          condition: "Good",
          similarity: 88
        }
      ]

      // Simulate API delay
      setTimeout(() => {
        setSimilarItems(mockSimilarItems)
        setLoading(false)
      }, 2000)
    }

    fetchSimilarItems()
  }, [auction])

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold">Similar Items Found</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {similarItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-[#232326] rounded-lg hover:bg-[#2a2a2e] transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span className="text-green-400 font-semibold">{item.price}</span>
                  <span>•</span>
                  <span>{item.source}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.similarity >= 90 ? 'bg-green-400' : 
                      item.similarity >= 85 ? 'bg-yellow-400' : 'bg-orange-400'
                    }`}></div>
                    <span className="text-xs text-gray-400">{item.similarity}% match</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-purple-300 text-xs font-medium">AI Market Analysis</p>
            <p className="text-gray-300 text-xs mt-1">
              Based on recent sales, this item is priced competitively. Similar pieces have appreciated 15% over the past year.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ NEW: AI Authenticity Verification Component
function AIAuthenticityCheck({ auction }) {
  const [verificationData, setVerificationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI authenticity analysis
    const analyzeAuthenticity = async () => {
      setLoading(true)
      
      // Mock authenticity data (replace with real AI API call)
      const mockVerification = {
        overallScore: 92,
        confidence: "High",
        indicators: [
          { 
            feature: "Crown Logo", 
            status: "authentic", 
            confidence: 95,
            details: "Correct proportions and engraving depth match 1971 specifications"
          },
          { 
            feature: "Serial Number", 
            status: "authentic", 
            confidence: 98,
            details: "Serial format consistent with 1971 production records"
          },
          { 
            feature: "Case Construction", 
            status: "authentic", 
            confidence: 90,
            details: "Proper case thickness and lug shape for period"
          },
          { 
            feature: "Movement", 
            status: "authentic", 
            confidence: 88,
            details: "Cal. 1570 movement consistent with year and model"
          },
          { 
            feature: "Dial Aging", 
            status: "warning", 
            confidence: 75,
            details: "Some patina present - verify with professional inspection"
          }
        ],
        redFlags: [
          "Minor dial inconsistency requires professional verification"
        ],
        recommendations: [
          "Request additional movement photos",
          "Verify service history documentation",
          "Consider professional authentication before bidding"
        ]
      }

      // Simulate API delay
      setTimeout(() => {
        setVerificationData(mockVerification)
        setLoading(false)
      }, 3000)
    }

    analyzeAuthenticity()
  }, [auction])

  if (loading) {
    return (
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">Authenticity Analysis</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-blue-400 text-sm">Analyzing authenticity indicators...</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold">Authenticity Analysis</h3>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm font-medium">Authenticity Score</span>
          <span className={`font-bold text-lg ${
            verificationData.overallScore >= 90 ? 'text-green-400' :
            verificationData.overallScore >= 80 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {verificationData.overallScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              verificationData.overallScore >= 90 ? 'bg-green-400' :
              verificationData.overallScore >= 80 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${verificationData.overallScore}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Confidence Level: {verificationData.confidence}
        </p>
      </div>

      {/* Verification Indicators */}
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-semibold text-white">Verification Points</h4>
        {verificationData.indicators.map((indicator, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-[#232326] rounded-lg">
            <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
              indicator.status === 'authentic' ? 'bg-green-400' :
              indicator.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium">{indicator.feature}</span>
                <span className="text-xs text-gray-400">{indicator.confidence}%</span>
              </div>
              <p className="text-xs text-gray-400">{indicator.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Red Flags */}
      {verificationData.redFlags.length > 0 && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Attention Required
          </h4>
          <ul className="text-xs text-red-300 space-y-1">
            {verificationData.redFlags.map((flag, index) => (
              <li key={index}>• {flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          AI Recommendations
        </h4>
        <ul className="text-xs text-blue-300 space-y-1">
          {verificationData.recommendations.map((rec, index) => (
            <li key={index}>• {rec}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ✅ NEW: AI Investment Insights Component
function AIInvestmentInsights({ auction }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true)
      
      // Mock investment insights (replace with real AI API call)
      const mockInsights = {
        marketTrend: "Bullish",
        priceAppreciation: "+18%",
        timeframe: "Past 12 months",
        rarity: "Moderate",
        liquidityScore: 85,
        investmentGrade: "A-",
        keyFactors: [
          "Vintage Rolex watches have shown consistent appreciation",
          "1971 Datejust models are increasingly sought after",
          "Presence of original papers adds 20-25% premium",
          "Jubilee bracelet configuration preferred by collectors"
        ],
        risks: [
          "Servicing costs can be significant ($800-1200)",
          "Market sensitivity to luxury goods cycles",
          "Authentication challenges in vintage pieces"
        ],
        outlook: "Strong collector demand expected to continue. Similar models have outperformed luxury watch index by 12% annually."
      }

      setTimeout(() => {
        setInsights(mockInsights)
        setLoading(false)
      }, 2500)
    }

    fetchInsights()
  }, [auction])

  if (loading) {
    return (
      <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">Investment Analysis</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold">Investment Insights</h3>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#232326] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Market Trend</div>
          <div className={`font-bold text-sm ${
            insights.marketTrend === 'Bullish' ? 'text-green-400' :
            insights.marketTrend === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {insights.marketTrend}
          </div>
        </div>
        <div className="bg-[#232326] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Price Change</div>
          <div className="font-bold text-green-400 text-sm">{insights.priceAppreciation}</div>
        </div>
        <div className="bg-[#232326] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Liquidity</div>
          <div className="font-bold text-blue-400 text-sm">{insights.liquidityScore}/100</div>
        </div>
        <div className="bg-[#232326] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Investment Grade</div>
          <div className="font-bold text-purple-400 text-sm">{insights.investmentGrade}</div>
        </div>
      </div>

      {/* Key Factors */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2">Investment Factors</h4>
        <ul className="space-y-1">
          {insights.keyFactors.map((factor, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
              <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2">Risk Factors</h4>
        <ul className="space-y-1">
          {insights.risks.map((risk, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
              <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
              {risk}
            </li>
          ))}
        </ul>
      </div>

      {/* Outlook */}
      <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
        <h4 className="text-sm font-semibold text-green-400 mb-2">Market Outlook</h4>
        <p className="text-xs text-green-300">{insights.outlook}</p>
      </div>
    </div>
  )
}

// ✅ ENHANCED: Mobile-optimized Countdown Timer Component
function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date()
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
          setIsUrgent(hours < 1)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`)
          setIsUrgent(minutes < 30)
        } else {
          setTimeLeft(`${seconds}s`)
          setIsUrgent(true)
        }
      } else {
        setTimeLeft('ENDED')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className={`text-center p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 ${
      timeLeft === 'ENDED' ? 'border-gray-500 bg-gray-900' :
      isUrgent ? 'border-red-500 bg-red-900/20 animate-pulse' : 
      'border-orange-500 bg-orange-900/20'
    }`}>
      <div className="text-xs sm:text-sm text-gray-400 mb-2">Time Remaining</div>
      <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
        timeLeft === 'ENDED' ? 'text-gray-400' :
        isUrgent ? 'text-red-400' : 'text-orange-400'
      }`}>
        {timeLeft}
      </div>
      {timeLeft !== 'ENDED' && (
        <div className="text-xs text-gray-400 mt-2">
          {isUrgent ? 'Auction ending soon!' : 'Plenty of time left'}
        </div>
      )}
    </div>
  )
}

// ✅ ENHANCED: Mobile-optimized Bid Form Component
function BidForm({ auction, onBidSubmit }) {
  const [bidAmount, setBidAmount] = useState('')
  const [maxBid, setMaxBid] = useState('')
  const [isProxyBid, setIsProxyBid] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const minBid = auction.currentBid + 25 // $25 minimum increment
  const suggestedBids = [
    auction.currentBid + 25,
    auction.currentBid + 50,
    auction.currentBid + 100,
    auction.currentBid + 250
  ]

  const validateBid = (amount) => {
    const numAmount = parseFloat(amount)
    const newErrors = {}

    if (!amount) {
      newErrors.bidAmount = 'Bid amount is required'
    } else if (isNaN(numAmount)) {
      newErrors.bidAmount = 'Please enter a valid number'
    } else if (numAmount < minBid) {
      newErrors.bidAmount = `Minimum bid is $${minBid.toLocaleString()}`
    } else if (numAmount > 1000000) {
      newErrors.bidAmount = 'Maximum bid is $1,000,000'
    }

    if (isProxyBid) {
      const numMaxBid = parseFloat(maxBid)
      if (!maxBid) {
        newErrors.maxBid = 'Maximum bid is required for proxy bidding'
      } else if (isNaN(numMaxBid)) {
        newErrors.maxBid = 'Please enter a valid number'
      } else if (numMaxBid <= numAmount) {
        newErrors.maxBid = 'Maximum bid must be higher than current bid'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateBid(bidAmount)) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onBidSubmit({
        amount: parseFloat(bidAmount),
        maxBid: isProxyBid ? parseFloat(maxBid) : null,
        isProxy: isProxyBid
      })

      // Reset form
      setBidAmount('')
      setMaxBid('')
      setIsProxyBid(false)
      
    } catch (error) {
      setErrors({ submit: 'Failed to place bid. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Place Your Bid</h3>
      
      {/* Current Status */}
      <div className="bg-[#232326] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Current Bid</span>
            <span className="text-xl sm:text-2xl font-bold text-orange-400">
              ${auction.currentBid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Minimum Bid</span>
            <span className="text-base sm:text-lg font-semibold text-white">
              ${minBid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Reserve Price</span>
            <span className={`text-sm font-medium ${
              auction.reserveMet ? 'text-green-400' : 'text-red-400'
            }`}>
              {auction.reserveMet ? 'Met' : 'Not Met'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Bid Buttons */}
      <div className="mb-4 sm:mb-6">
        <div className="text-sm text-gray-400 mb-3">Quick Bid Amounts</div>
        <div className="grid grid-cols-2 gap-2">
          {suggestedBids.map((amount) => (
            <button
              key={amount}
              onClick={() => setBidAmount(amount.toString())}
              className="bg-[#232326] hover:bg-orange-500 active:bg-orange-600 text-white py-2 px-3 sm:px-4 rounded-lg transition touch-manipulation text-sm sm:text-base"
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Bid Amount Input */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Your Bid Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              onBlur={() => validateBid(bidAmount)}
              className={`w-full bg-[#232326] border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base ${
                errors.bidAmount ? 'border-red-500' : 'border-[#333]'
              }`}
              placeholder={minBid.toLocaleString()}
              min={minBid}
              step="0.01"
            />
          </div>
          {errors.bidAmount && (
            <p className="text-red-400 text-xs mt-1">{errors.bidAmount}</p>
          )}
        </div>

        {/* Advanced Options Toggle - Mobile */}
        <div className="mb-4 sm:hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-orange-400 text-sm font-medium flex items-center gap-1"
          >
            Advanced Options
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Proxy Bidding Option */}
        <div className={`mb-4 ${showAdvanced ? 'block' : 'hidden sm:block'}`}>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={isProxyBid}
              onChange={(e) => setIsProxyBid(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
            />
            <div className="ml-3">
              <span className="text-gray-300 text-sm">
                Enable Automatic Bidding (Proxy Bid)
              </span>
              <p className="text-xs text-gray-400 mt-1">
                We&apos;ll bid on your behalf up to your maximum amount
              </p>
            </div>
          </label>
        </div>

        {/* Max Bid Input (shown when proxy bidding is enabled) */}
        {isProxyBid && (
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Maximum Bid Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value)}
                className={`w-full bg-[#232326] border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base ${
                  errors.maxBid ? 'border-red-500' : 'border-[#333]'
                }`}
                placeholder="Enter your maximum bid"
                step="0.01"
              />
            </div>
            {errors.maxBid && (
              <p className="text-red-400 text-xs mt-1">{errors.maxBid}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !bidAmount}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition touch-manipulation text-sm sm:text-base"
        >
          {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
        </button>

        {errors.submit && (
          <p className="text-red-400 text-sm mt-2 text-center">{errors.submit}</p>
        )}
      </form>

      {/* Bidding Terms - Collapsible on Mobile */}
      <div className="mt-4 sm:mt-6">
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-white mb-2 flex items-center justify-between">
            Bidding Terms
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-3 sm:p-4 bg-[#232326] rounded-lg">
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• All bids are binding and cannot be retracted</li>
              <li>• You agree to complete purchase if you win</li>
              <li>• Payment is due within 48 hours of auction end</li>
              <li>• Shipping costs are additional to winning bid</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}

// ✅ ENHANCED: Mobile-optimized Image Gallery Component
function ImageGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-[#232326] rounded-lg sm:rounded-xl overflow-hidden">
        <img
          src={images[selectedImage] || '/placeholder-auction.jpg'}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs sm:text-sm">
          {selectedImage + 1} / {images.length}
        </div>
        
        {/* Mobile Navigation Arrows */}
        <div className="sm:hidden absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button
            onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
            className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
            className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Thumbnail Grid - Hidden on mobile, visible on larger screens */}
      <div className="hidden sm:grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-[#232326] rounded-lg overflow-hidden border-2 transition touch-manipulation ${
              selectedImage === index ? 'border-orange-500' : 'border-transparent hover:border-gray-500'
            }`}
          >
            <img
              src={image || '/placeholder-auction.jpg'}
              alt={`${title} view ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      
      {/* Mobile Dot Indicators */}
      <div className="flex justify-center gap-2 sm:hidden">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-2 h-2 rounded-full transition ${
              selectedImage === index ? 'bg-orange-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ✅ ENHANCED: Mobile-optimized Bid History Component
function BidHistory({ bidHistory }) {
  const [showAll, setShowAll] = useState(false)
  const displayHistory = showAll ? bidHistory : bidHistory.slice(0, 3)

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Bid History</h3>
      <div className="space-y-2 sm:space-y-3">
        {displayHistory.map((bid, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-[#232326] last:border-b-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${bid.isWinning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300 text-sm sm:text-base truncate">{bid.bidder}</span>
              {bid.isWinning && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded flex-shrink-0">Winning</span>}
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="font-semibold text-white text-sm sm:text-base">${bid.amount.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{bid.time}</div>
            </div>
          </div>
        ))}
      </div>
      
      {bidHistory.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 text-orange-400 hover:text-orange-300 text-sm font-medium transition"
        >
          {showAll ? 'Show Less' : `Show All ${bidHistory.length} Bids`}
        </button>
      )}
    </div>
  )
}

// ✅ ENHANCED: Mobile-optimized Seller Info Component  
function SellerInfo({ seller }) {
  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Seller Information</h3>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
          {seller.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm sm:text-base truncate">{seller.name}</h4>
            {seller.verified && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2">
            <span>⭐ {seller.rating}/5.0</span>
            <span>{seller.totalSales} sales</span>
            <span>Joined {seller.joinedDate}</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">{seller.location}</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#232326]">
        <Link href={`/profile`} className="text-orange-400 hover:text-orange-300 text-sm font-medium">
          View Seller Profile →
        </Link>
      </div>
    </div>
  )
}

// ✅ ENHANCED: Main Page Component with AI Features
export default function AuctionDetailPage() {
  const params = useParams()
  const auction = getAuctionById(params.id)
  const [showBidSuccess, setShowBidSuccess] = useState(false)

  const handleBidSubmit = (bidData) => {
    console.log('Bid submitted:', bidData)
    setShowBidSuccess(true)
    setTimeout(() => setShowBidSuccess(false), 5000)
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Auction Not Found</h1>
          <Link href="/auctions" className="text-orange-400 hover:text-orange-300">
            ← Back to Auctions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* Bid Success Notification */}
      {showBidSuccess && (
        <div className="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto sm:w-auto bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm sm:text-base">Bid placed successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 overflow-x-auto">
            <Link href="/" className="hover:text-orange-400 whitespace-nowrap">Home</Link>
            <span className="flex-shrink-0">/</span>
            <Link href="/auctions" className="hover:text-orange-400 whitespace-nowrap">Auctions</Link>
            <span className="flex-shrink-0">/</span>
            <span className="text-white truncate">{auction.title}</span>
          </div>
        </nav>

        {/* ✅ NEW: Enhanced Layout with AI Features */}
        <div className="space-y-6 xl:grid xl:grid-cols-4 xl:gap-8 xl:space-y-0">
          {/* Left Column - Images and Description */}
          <div className="xl:col-span-2 space-y-6 sm:space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={auction.images} title={auction.title} />

            {/* Item Description with AI Enhancement */}
            <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold flex-1">{auction.title}</h2>
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{auction.description}</p>
              </div>

              {/* AI Enhanced Specifications */}
              <div className="mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Detailed Specifications</h3>
                <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  {Object.entries(auction.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between sm:flex-col sm:justify-start py-2 border-b border-[#232326] sm:border-b-0">
                      <span className="text-gray-400 text-sm">{key}</span>
                      <span className="text-white font-medium text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Market Context */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <h4 className="text-blue-300 text-sm font-semibold mb-1">Collector's Context</h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      This 1971 Datejust represents the golden era of Rolex manufacturing. The ref. 1601 with its 
                      cal. 1570 movement is highly regarded among collectors for its reliability and classic proportions. 
                      The presence of original papers and box significantly enhances its collectibility and future value.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="mt-6 pt-6 border-t border-[#232326]">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Shipping: ${auction.shipping.cost} (Standard)</p>
                  <p>• International shipping available</p>
                  <p>• 7-day return policy for authenticity issues</p>
                  <p>• Fully insured shipping with tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Bidding and Info */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Countdown Timer */}
            <CountdownTimer endTime={auction.endTime} />

            {/* Bid Form */}
            <BidForm auction={auction} onBidSubmit={handleBidSubmit} />

            {/* Seller Info */}
            <SellerInfo seller={auction.seller} />

            {/* Bid History */}
            <BidHistory bidHistory={auction.bidHistory} />
          </div>

          {/* ✅ NEW: Right Column - AI Features */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* AI Authenticity Check */}
            <AIAuthenticityCheck auction={auction} />

            {/* AI Similar Items */}
            <AISimilarItems auction={auction} />

            {/* AI Investment Insights */}
            <AIInvestmentInsights auction={auction} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
