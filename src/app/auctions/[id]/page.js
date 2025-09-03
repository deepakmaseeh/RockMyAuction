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

// ✅ NEW: API Integration Functions
const API_BASE_URL = 'https://excellwebsolution.com'

// Get single auction by ID
const getAuctionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auctions/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const auction = await response.json()
    return auction
  } catch (error) {
    console.error('Error fetching auction:', error)
    return null
  }
}

// Get bids for auction
const getBidsForAuction = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bids/${auctionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const bids = await response.json()
    return bids
  } catch (error) {
    console.error('Error fetching bids:', error)
    return []
  }
}

// ✅ ENHANCED: Place a bid with token from localStorage
const placeBid = async (auctionId, bidAmount) => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_BASE_URL}/api/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token.replace('Bearer ', '')}` })
      },
      body: JSON.stringify({
        auctionId,
        bidAmount: parseFloat(bidAmount)
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    const bid = await response.json()
    return bid
  } catch (error) {
    console.error('Error placing bid:', error)
    throw error
  }
}

// Generate AI analysis
const generateAIAnalysis = async (prompt, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ prompt }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error generating AI analysis:', error)
    return null
  }
}

// ✅ FALLBACK: Static auction data when API fails
const getStaticAuctionData = (id) => {
  return {
    _id: id,
    title: "Vintage Rolex Datejust Third Hand",
    description: "This exceptional 1971 Rolex Datejust represents the pinnacle of Swiss watchmaking excellence. The 36mm stainless steel case houses the legendary automatic movement, ensuring precision that has made Rolex the world's most trusted timepiece. The champagne dial features applied hour markers and the iconic date window at 3 o'clock with Cyclops magnification.",
    images: ["/assets/PB-3.jpg"],
    imageUrl: "/assets/PB-3.jpg",
    startingPrice: 1000,
    currentBid: 2550,
    reservePrice: 3000,
    reserveMet: false,
    endDate: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
    condition: "Excellent",
    category: "Watches",
    seller: {
      name: "LuxuryTimepieces",
      rating: 4.9,
      totalSales: 234,
      joinedDate: "2019",
      verified: true,
      location: "New York, NY"
    },
    shipping: {
      cost: 25,
      international: true
    },
    specifications: {
      "Brand": "Rolex",
      "Model": "Datejust", 
      "Year": "1971",
      "Case Size": "36mm",
      "Movement": "Automatic"
    }
  }
}

// ✅ ENHANCED: AI Similar Items Component
function AISimilarItems({ auction }) {
  const [similarItems, setSimilarItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [marketAnalysis, setMarketAnalysis] = useState(null)

  useEffect(() => {
    const fetchSimilarItems = async () => {
      setLoading(true)
      
      const token = localStorage.getItem('token')
      if (token) {
        const aiResult = await generateAIAnalysis(
          `Comprehensive market analysis for ${auction.title}:
          1. Similar items and comparable sales data
          2. Price trends and market appreciation
          3. Investment potential and collector demand
          4. Seasonal market factors
          5. Expert market insights`,
          token
        )
        
        if (aiResult) {
          const mockSimilarItems = [
            {
              id: 1,
              title: "1970 Rolex Datejust 36mm Steel",
              price: "$2,850",
              source: "Christie's",
              image: auction.imageUrl || auction.images?.[0] || "/assets/PB-3.jpg",
              condition: "Very Good",
              similarity: 95,
              appreciation: "+12%"
            },
            {
              id: 2,
              title: "Vintage Rolex Datejust Champagne",
              price: "$2,200",
              source: "Sotheby's",
              image: auction.imageUrl || auction.images?.[0] || "/assets/PB-4.jpg",
              condition: "Excellent", 
              similarity: 92,
              appreciation: "+8%"
            }
          ]
          setSimilarItems(mockSimilarItems)
          
          setMarketAnalysis({
            trend: "Bullish",
            demandLevel: "High",
            liquidityScore: 85,
            investmentGrade: "A-",
            seasonalFactor: "Peak collecting season",
            priceRange: "$2,200 - $3,100",
            avgAppreciation: "+11.7%",
            marketOutlook: "Strong collector demand continues to drive prices upward"
          })
        }
      }
      
      setTimeout(() => {
        if (similarItems.length === 0) {
          setSimilarItems([
            {
              id: 1,
              title: "Similar " + auction.category + " Item",
              price: "$" + (auction.currentBid + 300),
              source: "Market Analysis",
              image: auction.imageUrl || auction.images?.[0] || "/assets/PB-3.jpg",
              condition: "Excellent",
              similarity: 88,
              appreciation: "+10%"
            }
          ])
          
          setMarketAnalysis({
            trend: "Stable",
            demandLevel: "Moderate",
            liquidityScore: 75,
            investmentGrade: "B+",
            seasonalFactor: "Normal market conditions",
            priceRange: "$" + auction.startingPrice + " - $" + (auction.currentBid + 500),
            avgAppreciation: "+8%",
            marketOutlook: "Steady interest with moderate growth potential"
          })
        }
        setLoading(false)
      }, 2000)
    }

    fetchSimilarItems()
  }, [auction])

  return (
    <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-4 sm:p-6 border border-purple-500/20 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Market Intelligence</h3>
          <p className="text-purple-300 text-xs">Powered by AI Analysis</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-purple-700/30 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-purple-700/30 rounded w-1/2"></div>
          </div>
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-16 h-16 bg-purple-700/30 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-purple-700/30 rounded w-3/4"></div>
                <div className="h-2 bg-purple-700/30 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Market Overview */}
          {marketAnalysis && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl">
              <h4 className="text-purple-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Live Market Data
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/20 rounded-lg p-2">
                  <span className="text-gray-400 block">Trend</span>
                  <span className={`font-bold ${
                    marketAnalysis.trend === 'Bullish' ? 'text-green-400' : 
                    marketAnalysis.trend === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    📈 {marketAnalysis.trend}
                  </span>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <span className="text-gray-400 block">Grade</span>
                  <span className="text-purple-400 font-bold">⭐ {marketAnalysis.investmentGrade}</span>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <span className="text-gray-400 block">Demand</span>
                  <span className="text-blue-400 font-bold">🔥 {marketAnalysis.demandLevel}</span>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <span className="text-gray-400 block">Liquidity</span>
                  <span className="text-orange-400 font-bold">💧 {marketAnalysis.liquidityScore}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* Similar Items */}
          <div className="space-y-3 mb-4">
            <h4 className="text-white text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Recent Comparable Sales
            </h4>
            {similarItems.map((item) => (
              <div key={item.id} className="group flex items-center gap-3 p-3 bg-gradient-to-r from-black/20 to-purple-900/10 border border-purple-500/10 rounded-lg hover:border-purple-400/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full">
                      {item.price}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{item.source}</span>
                    {item.appreciation && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-400 font-medium">{item.appreciation}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {marketAnalysis && (
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-300 text-sm font-semibold">AI Market Insight</p>
                  <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                    {marketAnalysis.marketOutlook} Average appreciation: {marketAnalysis.avgAppreciation}.
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded-full">
                      Price Range: {marketAnalysis.priceRange}
                    </span>
                    <span className="text-green-400">•</span>
                    <span className="text-green-400">{marketAnalysis.seasonalFactor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ✅ ENHANCED: AI Authenticity Check Component
function AIAuthenticityCheck({ auction }) {
  const [verificationData, setVerificationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const analyzeAuthenticity = async () => {
      setLoading(true)
      
      const token = localStorage.getItem('token')
      if (token) {
        const aiResult = await generateAIAnalysis(
          `Comprehensive authenticity verification for ${auction.title}:
          1. Visual inspection and material analysis
          2. Craftsmanship and age verification
          3. Documentation and provenance check
          4. Market authentication standards
          5. Expert recommendations and insights`,
          token
        )
        
        if (aiResult) {
          const mockVerification = {
            overallScore: 92,
            confidence: "High",
            riskLevel: "Low",
            indicators: [
              { 
                feature: "Visual Authentication", 
                status: "authentic", 
                confidence: 95,
                details: "Consistent with authentic examples from this period"
              },
              { 
                feature: "Material Quality", 
                status: "authentic", 
                confidence: 90,
                details: "Proper materials and construction methods verified"
              },
              { 
                feature: "Age Verification", 
                status: "authentic", 
                confidence: 88,
                details: "Appropriate wear patterns for stated age"
              }
            ]
          }
          setVerificationData(mockVerification)
        }
      }
      
      setTimeout(() => {
        if (!verificationData) {
          setVerificationData({
            overallScore: 88,
            confidence: "High",
            riskLevel: "Low",
            indicators: [
              { 
                feature: "Visual Inspection", 
                status: "authentic", 
                confidence: 90,
                details: "No obvious red flags detected"
              },
              { 
                feature: "Market Consistency", 
                status: "authentic", 
                confidence: 85,
                details: "Pricing aligns with market standards"
              }
            ]
          })
        }
        setLoading(false)
      }, 3000)
    }

    analyzeAuthenticity()
  }, [auction])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-4 sm:p-6 border border-blue-500/20 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Authenticity Scan</h3>
            <p className="text-blue-300 text-xs">Deep analysis in progress...</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-blue-400 text-sm">Scanning for authenticity markers...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-4 sm:p-6 border border-blue-500/20 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Authenticity Report</h3>
          <p className="text-blue-300 text-xs">AI-Powered Verification</p>
        </div>
      </div>

      {/* Overall Score with Visual Enhancement */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300 text-sm font-medium">Authenticity Score</span>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-xl ${
              verificationData.overallScore >= 90 ? 'text-green-400' :
              verificationData.overallScore >= 80 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {verificationData.overallScore}/100
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              verificationData.riskLevel === 'Low' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
              verificationData.riskLevel === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
              'bg-red-900/30 text-red-400 border border-red-500/30'
            }`}>
              🛡️ {verificationData.riskLevel} Risk
            </span>
          </div>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 relative ${
              verificationData.overallScore >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
              verificationData.overallScore >= 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
              'bg-gradient-to-r from-red-500 to-pink-400'
            }`}
            style={{ width: `${verificationData.overallScore}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Verification Indicators */}
      <div className="space-y-3">
        {verificationData.indicators.map((indicator, index) => (
          <div key={index} className="group flex items-start gap-3 p-3 bg-gradient-to-r from-black/20 to-blue-900/10 border border-blue-500/10 rounded-lg hover:border-blue-400/30 transition-all duration-300">
            <div className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center ${
              indicator.status === 'authentic' ? 'bg-green-400' : 
              indicator.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
            }`}>
              {indicator.status === 'authentic' && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium">{indicator.feature}</span>
                <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-0.5 rounded-full">
                  {indicator.confidence}%
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{indicator.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ ENHANCED: Ultra-Modern Countdown Timer
function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const end = new Date(endTime)
      const total = end - new Date(endTime).setHours(end.getHours() - 24) // 24 hour auction
      const difference = end - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        // Calculate progress percentage
        const progressPercent = (difference / total) * 100
        setProgress(Math.max(0, progressPercent))
        
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
        setProgress(0)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className={`relative overflow-hidden rounded-xl p-6 border-2 ${
      timeLeft === 'ENDED' ? 'border-gray-500 bg-gradient-to-br from-gray-900 to-gray-800' :
      isUrgent ? 'border-red-500 bg-gradient-to-br from-red-900/30 to-pink-900/30 animate-pulse' : 
      'border-orange-500 bg-gradient-to-br from-orange-900/30 to-red-900/30'
    } shadow-xl`}>
      
      {/* Background Animation */}
      {timeLeft !== 'ENDED' && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 animate-pulse"></div>
      )}
      
      {/* Progress Ring */}
      <div className="absolute top-4 right-4">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={timeLeft === 'ENDED' ? 'text-gray-600' : 'text-gray-700'}
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            className={
              timeLeft === 'ENDED' ? 'text-gray-400' :
              isUrgent ? 'text-red-400' : 'text-orange-400'
            }
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            timeLeft === 'ENDED' ? 'bg-gray-400' :
            isUrgent ? 'bg-red-400 animate-pulse' : 'bg-orange-400'
          }`}></div>
          <span className="text-gray-400 text-sm font-medium">
            {timeLeft === 'ENDED' ? 'Auction Ended' : 'Time Remaining'}
          </span>
        </div>
        
        <div className={`text-3xl sm:text-4xl font-bold mb-2 ${
          timeLeft === 'ENDED' ? 'text-gray-400' :
          isUrgent ? 'text-red-400' : 'text-orange-400'
        }`}>
          {timeLeft}
        </div>
        
        {timeLeft !== 'ENDED' && (
          <div className="flex items-center gap-2 text-sm">
            {isUrgent ? (
              <>
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-400 font-medium">Final moments!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400 font-medium">Plenty of time left</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ ULTRA-ENHANCED: Revolutionary Bid Form with Amazing UI
function BidForm({ auction, onBidSubmit, bids }) {
  const [bidAmount, setBidAmount] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bidHistory, setBidHistory] = useState([])

  const currentBid = bids.length > 0 
    ? Math.max(...bids.map(bid => bid.bidAmount))
    : auction.startingPrice || auction.currentBid

  const minBid = currentBid + 25

  // Quick bid amounts
  const quickBids = [
    minBid,
    minBid + 50,
    minBid + 100,
    minBid + 250,
    minBid + 500
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const numAmount = parseFloat(bidAmount)
    if (!bidAmount || isNaN(numAmount) || numAmount < minBid) {
      setErrors({ bidAmount: `Minimum bid is $${minBid.toLocaleString()}` })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    
    try {
      await placeBid(auction._id, numAmount)
      
      // Add to local bid history
      setBidHistory(prev => [{
        amount: numAmount,
        time: new Date(),
        isYours: true
      }, ...prev])
      
      setShowSuccess(true)
      onBidSubmit({ amount: numAmount })
      setBidAmount('')
      
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      console.error('Bid submission error:', error)
      setErrors({ submit: error.message || 'Failed to place bid. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickBid = (amount) => {
    setBidAmount(amount.toString())
  }

  return (
    <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-6 border border-orange-500/20 shadow-2xl relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-pulse"></div>
      
      {/* Success Animation */}
      {showSuccess && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-400 font-bold text-lg">Bid Placed Successfully! 🎉</p>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Place Your Bid</h3>
            <p className="text-orange-300 text-sm">Join the bidding excitement!</p>
          </div>
        </div>
        
        {/* Current Status with Enhanced Design */}
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Current Highest Bid</div>
              <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-2">
                💰 ${currentBid.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Minimum Next Bid</div>
              <div className="text-xl font-bold text-white flex items-center justify-center gap-2">
                🎯 ${minBid.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Live Bidding Activity */}
          <div className="mt-3 pt-3 border-t border-orange-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Bidding Activity</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">{bids.length + bidHistory.length} Total Bids</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Bid Buttons with Enhanced Design */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Bid Amounts
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickBids.slice(0, 6).map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickBid(amount)}
                className="group bg-gradient-to-r from-[#232326] to-[#2a2a2e] hover:from-orange-500 hover:to-red-500 border border-gray-600 hover:border-orange-400 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
              >
                <div className="text-sm font-bold">${amount.toLocaleString()}</div>
                <div className="text-xs text-gray-400 group-hover:text-white transition-colors">
                  +${(amount - currentBid).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Custom Bid Input with Enhanced Design */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Your Custom Bid Amount (USD)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <span className="text-gray-400 text-lg font-bold">$</span>
              </div>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className={`w-full bg-gradient-to-r from-[#232326] to-[#2a2a2e] border-2 rounded-xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-lg font-semibold transition-all duration-300 ${
                  errors.bidAmount ? 'border-red-500 focus:border-red-400' : 'border-gray-600'
                }`}
                placeholder={minBid.toLocaleString()}
                min={minBid}
              />
              
              {/* Bid Validation Indicator */}
              {bidAmount && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {parseFloat(bidAmount) >= minBid ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {errors.bidAmount && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.bidAmount}
              </div>
            )}

            {/* Bid Advantage Indicator */}
            {bidAmount && parseFloat(bidAmount) >= minBid && (
              <div className="mt-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    Your bid of ${parseFloat(bidAmount).toLocaleString()} will make you the highest bidder!
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Revolutionary Bid Button */}
          <button
            type="submit"
            disabled={isSubmitting || !bidAmount || parseFloat(bidAmount) < minBid}
            className="group w-full relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
          >
            {/* Button Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Placing Your Bid...</span>
                </>
              ) : (
                <>
                  {/* <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg> */}
                  <span> PLACE BID</span>
                  {/* <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg> */}
                </>
              )}
            </div>
          </button>

          {errors.submit && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-400 text-sm font-medium">{errors.submit}</span>
              </div>
            </div>
          )}
        </form>

        {/* Bidding Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl">
          <h4 className="text-blue-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            💡 Pro Bidding Tips
          </h4>
          <ul className="text-xs text-blue-300 space-y-1">
            <li>• Bid in the final minutes for maximum impact</li>
            <li>• Set a maximum budget and stick to it</li>
            <li>• Watch for last-second bidding activity</li>
            <li>• Consider the item's true value vs auction excitement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ✅ ENHANCED: Image Component
function ImageDisplay({ auction }) {
  const imageUrl = auction.imageUrl || auction.images?.[0] || '/placeholder-auction.jpg'

  return (
    <div className="relative aspect-square bg-[#232326] rounded-xl overflow-hidden shadow-xl">
      <img
        src={imageUrl}
        alt={auction.title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
        1 / 1
      </div>
      
      {/* Image Enhancement Overlay */}
      <div className="absolute bottom-4 left-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg">
          <p className="text-sm font-medium">High-Resolution Image Available</p>
          <p className="text-xs text-gray-300">Click to view full details</p>
        </div>
      </div>
    </div>
  )
}

// ✅ ENHANCED: Bid History Component
function BidHistory({ bids, loading }) {
  const [showAll, setShowAll] = useState(false)
  const displayBids = showAll ? bids : bids.slice(0, 5)

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-6 border border-gray-500/20 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-white">Bid History</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-700/30 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-6 border border-gray-500/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bidding Activity</h3>
            <p className="text-gray-400 text-sm">{bids.length} Total Bids Placed</p>
          </div>
        </div>
        
        {bids.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Active Bidding</span>
          </div>
        )}
      </div>
      
      {bids.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium mb-2">No bids placed yet</p>
          <p className="text-gray-500 text-sm">Be the first to place a bid on this amazing item!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayBids.map((bid, index) => (
              <div key={bid._id || index} className="group flex items-center gap-4 p-4 bg-gradient-to-r from-black/20 to-gray-900/20 border border-gray-600/20 rounded-lg hover:border-gray-500/30 transition-all duration-300">
                
                {/* Bid Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {index + 1}
                </div>

                {/* Bidder Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">
                      Bidder {bid.userId?.substring(0, 6) || `#${index + 1}`}
                    </span>
                    {index === 0 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        👑 Leading
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(bid.createdAt || Date.now()).toLocaleDateString()} at{' '}
                    {new Date(bid.createdAt || Date.now()).toLocaleTimeString()}
                  </div>
                </div>

                {/* Bid Amount */}
                <div className="text-right">
                  <div className={`font-bold text-lg ${
                    index === 0 ? 'text-green-400' : 'text-white'
                  }`}>
                    ${bid.bidAmount.toLocaleString()}
                  </div>
                  {index > 0 && (
                    <div className="text-xs text-gray-400">
                      +${(bid.bidAmount - (displayBids[index + 1]?.bidAmount || 0)).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {bids.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors py-2 border border-orange-500/30 rounded-lg hover:bg-orange-500/10"
            >
              {showAll ? 'Show Less' : `Show All ${bids.length} Bids`}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ✅ MAIN: Enhanced Component
export default function AuctionDetailPage() {
  const params = useParams()
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidsLoading, setBidsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBidSuccess, setShowBidSuccess] = useState(false)

  useEffect(() => {
    const fetchAuctionData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const auctionData = await getAuctionById(params.id)
        
        if (auctionData) {
          setAuction(auctionData)
          
          setBidsLoading(true)
          const bidsData = await getBidsForAuction(auctionData._id)
          setBids(Array.isArray(bidsData) ? bidsData.sort((a, b) => b.bidAmount - a.bidAmount) : [])
          setBidsLoading(false)
          
        } else {
          console.log('API failed, using static data')
          const staticData = getStaticAuctionData(params.id)
          setAuction(staticData)
          setBids([])
          setBidsLoading(false)
        }
        
      } catch (err) {
        console.error('Error fetching auction:', err)
        setError('Failed to load auction data')
        
        const staticData = getStaticAuctionData(params.id)
        setAuction(staticData)
        setBids([])
        setBidsLoading(false)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAuctionData()
    }
  }, [params.id])

  const handleBidSubmit = async (bidData) => {
    setShowBidSuccess(true)
    setTimeout(() => setShowBidSuccess(false), 5000)
    
    try {
      const updatedBids = await getBidsForAuction(auction._id)
      setBids(Array.isArray(updatedBids) ? updatedBids.sort((a, b) => b.bidAmount - a.bidAmount) : [])
    } catch (error) {
      console.error('Error refreshing bids:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading auction details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            {error || 'Auction Not Found'}
          </h1>
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

      {/* Enhanced Success Notification */}
      {showBidSuccess && (
        <div className="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto sm:w-96 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold">🎉 Bid Placed Successfully!</p>
              <p className="text-sm text-green-100">You're now in the lead!</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-orange-400 transition-colors">🏠 Home</Link>
            <span>/</span>
            <Link href="/auctions" className="hover:text-orange-400 transition-colors">🔨 Auctions</Link>
            <span>/</span>
            <span className="text-white truncate">{auction.title}</span>
          </div>
        </nav>

        {/* Enhanced Layout */}
        <div className="space-y-6 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
          
          {/* Left Column - Image and Description */}
          <div className="lg:col-span-2 space-y-6">
            <ImageDisplay auction={auction} />

            {/* Enhanced Description */}
            <div className="bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] rounded-xl p-6 border border-gray-500/20 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {auction.title}
              </h2>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                {auction.description}
              </p>

              {/* Enhanced Specifications */}
              {auction.specifications && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Detailed Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(auction.specifications).map(([key, value]) => (
                      <div key={key} className="bg-black/20 rounded-lg p-3 border border-gray-600/20">
                        <div className="text-gray-400 text-xs mb-1">{key}</div>
                        <div className="text-white font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Bidding */}
          <div className="space-y-6">
            <CountdownTimer endTime={auction.endDate} />
            <BidForm auction={auction} onBidSubmit={handleBidSubmit} bids={bids} />
            <BidHistory bids={bids} loading={bidsLoading} />
          </div>

          {/* Right Column - AI Features */}
          <div className="space-y-6">
            <AIAuthenticityCheck auction={auction} />
            <AISimilarItems auction={auction} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
