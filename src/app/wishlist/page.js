// "use client"

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import WishlistButton from '@/components/WishlistButton'
// import { useWishlist } from '@/contexts/WishlistContext'
// import { useUserRole } from '@/contexts/RoleContext'

// export default function WishlistPage() {
//   const router = useRouter()
//   const { user } = useUserRole()
//   const { wishlistItems, loading, loadWishlist } = useWishlist()

//   useEffect(() => {
//     if (user) loadWishlist()
//   }, [user])

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-6xl mb-4">❤️</div>
//             <h1 className="text-2xl font-bold mb-2">Login to View Wishlist</h1>
//             <p className="text-gray-400 mb-6">Sign in to save and view your favorite auctions.</p>
//             <button
//               onClick={() => router.push('/login')}
//               className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition"
//             >
//               Login Now
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
//       <Navbar />
//       <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold">My Wishlist</h1>
//           <span className="text-gray-400">{loading ? 'Loading...' : `${wishlistItems.length} items`}</span>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
//           </div>
//         ) : wishlistItems.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">💔</div>
//             <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
//             <p className="text-gray-400 mb-6">Start exploring auctions and save your favorites by clicking the heart icon.</p>
//             <button
//               onClick={() => router.push('/auctions')}
//               className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition"
//             >
//               Discover Auctions
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {wishlistItems.map(item => (
//               <div
//                 key={item._id || item.id}
//                 onClick={() => router.push(`/auctions/${item._id || item.id}`)}
//                 className="bg-[#18181B] rounded-xl border border-[#232326] overflow-hidden cursor-pointer hover:shadow-lg transition"
//               >
//                 <div className="relative w-full h-48">
//                   <img
//                     src={item.images?.[0] || '/placeholder-auction.jpg'}
//                     alt={item.title}
//                     className="object-cover w-full h-full"
//                   />
//                   <div className="absolute top-2 right-2">
//                     <WishlistButton auctionId={item._id || item.id} size="md" />
//                   </div>
//                 </div>
//                 <div className="p-4 flex flex-col">
//                   <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
//                   <p className="text-gray-400 text-sm mb-3 flex-1 line-clamp-3">
//                     Current Bid: <span className="text-orange-400 font-bold">${(item.currentBid||item.startingPrice||0).toLocaleString()}</span>
//                   </p>
//                   <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
//                     <span>{item.bidCount||0} bids</span>
//                     <span>Ends: {new Date(item.endDate).toLocaleDateString()}</span>
//                   </div>
//                   <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition">
//                     Place Bid
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   )
// }
