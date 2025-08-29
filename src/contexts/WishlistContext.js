// 'use client'

// import { createContext, useContext, useState, useEffect } from 'react'
// import auctionAPI from '@/lib/auctionAPI'
// import { useUserRole } from './RoleContext'

// const WishlistContext = createContext()

// export function WishlistProvider({ children }) {
//   const { user } = useUserRole()
//   const [watchlistItems, setWatchlistItems] = useState([])
//   const [loading, setLoading] = useState(false)

//   // Load watchlist when user logs in
//   useEffect(() => {
//     if (user) loadWatchlist()
//     else setWatchlistItems([])
//   }, [user])

//   const loadWatchlist = async () => {
//     if (!user) return
//     setLoading(true)
//     try {
//       const data = await auctionAPI.getWishlist()
//       const items = Array.isArray(data) ? data : data.wishlist || []
      
//       // ✅ Transform API data to match your watchlist page format
//       const formattedItems = items.map(item => ({
//         id: item._id || item.id,
//         title: item.title,
//         images: item.images || [],
//         currentBid: item.currentBid || item.startingPrice || 0,
//         startingPrice: item.startingPrice || 0,
//         endDate: item.endDate,
//         status: new Date(item.endDate) > new Date() ? 'LIVE' : 'ENDED',
//         bids: item.bidCount || item.bids?.length || 0,
//         seller: item.seller?.name || item.seller || 'Unknown Seller',
//         category: item.category || 'General',
//         // Additional fields for your watchlist UI
//         highestBid: 0, // You can track user's highest bid separately
//         isWinning: false, // You can calculate this based on user's bids
//         watchedSince: new Date().toLocaleDateString(), // When added to watchlist
//         finalResult: new Date(item.endDate) <= new Date() ? 'UNKNOWN' : null
//       }))
      
//       setWatchlistItems(formattedItems)
//     } catch (e) {
//       console.error('Failed to load watchlist:', e)
//       setWatchlistItems([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const addToWatchlist = async (auctionData) => {
//     if (!user) {
//       alert('Please login to add to watchlist')
//       return false
//     }
    
//     try {
//       // ✅ Accept either auctionId or full auction object
//       const auctionId = typeof auctionData === 'string' ? auctionData : auctionData._id || auctionData.id
      
//       await auctionAPI.addToWishlist(auctionId)
      
//       // ✅ If full auction object provided, add it immediately to state
//       if (typeof auctionData === 'object') {
//         const formattedItem = {
//           id: auctionData._id || auctionData.id,
//           title: auctionData.title,
//           images: auctionData.images || [],
//           currentBid: auctionData.currentBid || auctionData.startingPrice || 0,
//           startingPrice: auctionData.startingPrice || 0,
//           endDate: auctionData.endDate,
//           status: new Date(auctionData.endDate) > new Date() ? 'LIVE' : 'ENDED',
//           bids: auctionData.bidCount || auctionData.bids?.length || 0,
//           seller: auctionData.seller?.name || auctionData.seller || 'Unknown Seller',
//           category: auctionData.category || 'General',
//           highestBid: 0,
//           isWinning: false,
//           watchedSince: 'Just added',
//           finalResult: new Date(auctionData.endDate) <= new Date() ? 'UNKNOWN' : null
//         }
        
//         setWatchlistItems(prev => [...prev, formattedItem])
//       } else {
//         // Reload from API if only ID provided
//         await loadWatchlist()
//       }
      
//       return true
//     } catch (e) {
//       console.error('Add to watchlist failed:', e)
//       return false
//     }
//   }

//   const removeFromWatchlist = async (auctionId) => {
//     if (!user) return false
    
//     try {
//       await auctionAPI.removeFromWishlist(auctionId)
//       setWatchlistItems(prev => prev.filter(item => item.id !== auctionId))
//       return true
//     } catch (e) {
//       console.error('Remove from watchlist failed:', e)
//       return false
//     }
//   }

//   const isInWatchlist = (auctionId) => {
//     return watchlistItems.some(item => item.id === auctionId)
//   }

//   const toggleWatchlist = async (auctionData) => {
//     const auctionId = typeof auctionData === 'string' ? auctionData : auctionData._id || auctionData.id
    
//     if (isInWatchlist(auctionId)) {
//       return await removeFromWatchlist(auctionId)
//     } else {
//       return await addToWatchlist(auctionData)
//     }
//   }

//   return (
//     <WishlistContext.Provider value={{
//       watchlistItems,
//       loading,
//       watchlistCount: watchlistItems.length,
//       addToWatchlist,
//       removeFromWatchlist,
//       isInWatchlist,
//       toggleWatchlist,
//       loadWatchlist
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   )
// }

// export const useWatchlist = () => {
//   const ctx = useContext(WishlistContext)
//   if (!ctx) throw new Error('useWatchlist must be used within WishlistProvider')
//   return ctx
// }
