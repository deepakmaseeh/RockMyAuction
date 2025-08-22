// 'use client'
// import { useState } from 'react'
// import { useUserRole } from '@/contexts/RoleContext'
// import dynamic from 'next/dynamic'

// // ─────────────────────────────────────────
// // 1. SAFER SIDEBAR IMPORT (works for both default and named exports, skips SSR)
// const Sidebar = dynamic(
//   () => import('@/components/Sidebar').then(m => m.default ?? m.Sidebar),
//   { ssr: false }
// )

// // ─────────────────────────────────────────
// // 2. PROPER SVG ICONS FOR SIDEBAR AND COMPONENTS
// const CurrencyDollarIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//   </svg>
// )

// const ShoppingBagIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
//   </svg>
// )

// const EyeIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// )

// const TrophyIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//   </svg>
// )

// const HeartIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//   </svg>
// )

// const ClockIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// )

// const ChartBarIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// )

// const PlusIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//   </svg>
// )

// const ClipboardListIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//   </svg>
// )

// const SearchIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// )

// const ChatIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//   </svg>
// )

// const TagIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//   </svg>
// )

// const PackageIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// )

// // ─────────────────────────────────────────
// // 3. MOBILE-OPTIMIZED HELPERS
// function StatsCard({ title, value, change, changeType, icon: Icon, color = 'orange' }) {
//   const isPositive = changeType === 'positive'
//   const colorClasses = {
//     orange: 'bg-orange-500/20 text-orange-400',
//     blue:   'bg-blue-500/20  text-blue-400',
//     green:  'bg-green-500/20 text-green-400',
//     purple: 'bg-purple-500/20 text-purple-400',
//     red:    'bg-red-500/20   text-red-400'
//   }

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] hover:border-orange-500/20 transition-all">
//       <div className="flex items-center justify-between mb-3 sm:mb-4">
//         <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
//           <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
//         </div>
//         {change && (
//           <div className={`flex items-center gap-1 text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
//             <span className="font-medium">{change}</span>
//           </div>
//         )}
//       </div>
//       <div className="space-y-1">
//         <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{value}</h3>
//         <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{title}</p>
//       </div>
      
//       {/* Mobile progress indicator */}
//       <div className="mt-3 sm:hidden">
//         <div className="w-full bg-gray-700 rounded-full h-1">
//           <div 
//             className={`h-1 rounded-full bg-${color}-500 transition-all duration-300`}
//             style={{ width: isPositive ? '70%' : '40%' }}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// function RecentActivity({ activities, type }) {
//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
//       <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Recent {type === 'seller' ? 'Sales' : 'Bids'}</h3>
//       <div className="space-y-3 sm:space-y-4">
//         {activities.length === 0 ? (
//           <div className="text-center py-6 sm:py-8">
//             <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
//               {type === 'seller' ? (
//                 <CurrencyDollarIcon className="w-6 h-6 text-gray-400" />
//               ) : (
//                 <TagIcon className="w-6 h-6 text-gray-400" />
//               )}
//             </div>
//             <p className="text-gray-400 text-sm">
//               No {type === 'seller' ? 'sales' : 'bids'} yet
//             </p>
//           </div>
//         ) : (
//           activities.map((a, i) => (
//             <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-[#232326] last:border-b-0 hover:bg-[#232326]/30 transition-colors rounded-lg px-2 sm:px-0">
//               <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//                 <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-[#232326] flex items-center justify-center flex-shrink-0">
//                   <PackageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-medium text-white text-sm sm:text-base truncate">{a.title}</h4>
//                   <p className="text-xs text-gray-400">{a.time}</p>
//                 </div>
//               </div>
//               <div className="text-right flex-shrink-0 ml-2">
//                 <div className="font-semibold text-white text-sm sm:text-base">${a.amount.toLocaleString()}</div>
//                 <div
//                   className={`text-xs px-2 py-1 rounded-full mt-1 ${
//                     a.status === 'won'
//                       ? 'bg-green-600 text-green-100'
//                       : a.status === 'sold'
//                       ? 'bg-blue-600 text-blue-100'
//                       : a.status === 'bidding'
//                       ? 'bg-orange-600 text-orange-100'
//                       : 'bg-gray-600 text-gray-100'
//                   }`}
//                 >
//                   {a.status}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// function QuickActions({ role }) {
//   const seller = [
//     { name: 'List New Item', shortName: 'Add Item', href: '/seller/new-auction', icon: PlusIcon, color: 'bg-green-600' },
//     { name: 'Manage Listings', shortName: 'Manage', href: '/seller/active-auctions', icon: ClipboardListIcon, color: 'bg-blue-600' },
//     { name: 'View Analytics', shortName: 'Analytics', href: '/seller/analytics', icon: ChartBarIcon, color: 'bg-purple-600' },
//     { name: 'Messages', shortName: 'Messages', href: '/messages', icon: ChatIcon, color: 'bg-orange-600' }
//   ]
//   const buyer = [
//     { name: 'Browse Auctions', shortName: 'Browse', href: '/auctions', icon: SearchIcon, color: 'bg-blue-600' },
//     { name: 'My Watchlist', shortName: 'Watchlist', href: '/watchlist', icon: HeartIcon, color: 'bg-green-600' },
//     { name: 'Bid History', shortName: 'Bids', href: '/bids', icon: TagIcon, color: 'bg-purple-600' },
//     { name: 'Messages', shortName: 'Messages', href: '/messages', icon: ChatIcon, color: 'bg-orange-600' }
//   ]
//   const actions = role === 'seller' ? seller : buyer

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
//       <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Quick Actions</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//         {actions.filter(a => !a.adminOnly || (a.adminOnly && user?.isAdmin)).map((a, i) => (
//           <button
//             key={i}
//             onClick={() => (window.location.href = a.href)}
//             className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-[#232326] hover:bg-[#2a2a2e] active:bg-[#323238] transition-all group touch-manipulation"
//           >
//             <div className={`p-2 sm:p-2.5 rounded-lg ${a.color} group-hover:scale-110 group-active:scale-105 transition-transform flex-shrink-0`}>
//               <a.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//             </div>
//             <div className="flex-1 min-w-0 text-left">
//               <span className="font-medium text-white text-sm sm:text-base block sm:hidden truncate">
//                 {a.shortName}
//               </span>
//               <span className="font-medium text-white text-sm sm:text-base hidden sm:block truncate">
//                 {a.name}
//               </span>
//             </div>
            
//             {/* Arrow indicator */}
//             <div className="text-gray-400 group-hover:text-orange-400 transition-colors flex-shrink-0">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// function PerformanceChart({ role }) {
//   const [timeframe, setTimeframe] = useState('7d')

//   return (
//     <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
//         <div className="flex items-center gap-2">
//           <ChartBarIcon className="w-5 h-5 text-orange-400" />
//           <h3 className="text-lg sm:text-xl font-bold">{role === 'seller' ? 'Sales' : 'Bidding'} Performance</h3>
//         </div>
//         <div className="flex bg-[#232326] rounded-lg p-1 self-start sm:self-auto">
//           {['7d', '30d'].map((period) => (
//             <button
//               key={period}
//               onClick={() => setTimeframe(period)}
//               className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition touch-manipulation ${
//                 timeframe === period
//                   ? 'bg-orange-500 text-white'
//                   : 'text-gray-400 hover:text-white active:bg-[#2a2a2e]'
//               }`}
//             >
//               {period}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-3 sm:space-y-4">
//         <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
//           <span className="text-2xl sm:text-3xl font-bold text-white">$12,845</span>
//           <span className="text-green-400 text-sm">+12.5%</span>
//         </div>

//         {/* Mobile-optimized chart */}
//         <div className="h-24 sm:h-32 bg-[#232326]/30 rounded-lg flex items-end justify-around p-2 sm:p-4 overflow-hidden">
//           {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
//             <div 
//               key={i} 
//               className="bg-orange-500 hover:bg-orange-400 rounded-t w-6 sm:w-8 transition-all duration-300 cursor-pointer" 
//               style={{ height: `${h}%` }}
//               title={`Day ${i + 1}: $${(h * 100).toLocaleString()}`}
//             />
//           ))}
//         </div>

//         <div className="text-xs sm:text-sm text-gray-400">
//           {role === 'seller' ? 'Total Revenue' : 'Total Bids Placed'} – Last 7 days
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────
// // 4. MOCK DATA WITH PROPER ICONS
// const sellerStats = [
//   { title: 'Total Revenue', value: '$12,845', change: '+12.5%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'green' },
//   { title: 'Active Listings', value: '23',     change: '+3',     changeType: 'positive', icon: ShoppingBagIcon,   color: 'blue'  },
//   { title: 'Total Views',    value: '1,247',  change: '+18.2%', changeType: 'positive', icon: EyeIcon,           color: 'purple'},
//   { title: 'Success Rate',   value: '94%',    change: '+2.1%',  changeType: 'positive', icon: TrophyIcon,        color: 'orange'}
// ]
// const buyerStats = [
//   { title: 'Items Won',     value: '18',   change: '+3',     changeType: 'positive', icon: TrophyIcon,        color: 'green' },
//   { title: 'Active Bids',   value: '7',    change: '+2',     changeType: 'positive', icon: ClockIcon,        color: 'blue'  },
//   { title: 'Watchlist Items', value: '34', change: '+8',     changeType: 'positive', icon: HeartIcon,        color: 'purple'},
//   { title: 'Total Spent',   value: '$8,920', change: '+24.3%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'orange'}
// ]

// const sellerActivities = [
//   { title: 'Vintage Rolex Datejust', amount: 2550, status: 'sold',    time: '2 hours ago' },
//   { title: 'KAWS Companion Figure',  amount:  850, status: 'bidding', time: '5 hours ago' },
//   { title: 'Air Jordan 1 Chicago',   amount: 1200, status: 'sold',    time: '1 day ago'   },
//   { title: 'Harry Potter 1st Edition', amount: 3500, status: 'bidding', time: '2 days ago'}
// ]
// const buyerActivities = [
//   { title: 'Vintage Guitar 1961',   amount: 15500, status: 'won',    time: '3 hours ago' },
//   { title: 'Mickey Mantle Card',    amount:  4200, status: 'bidding', time: '6 hours ago' },
//   { title: 'Abstract Sculpture',    amount:  2800, status: 'outbid',  time: '1 day ago'   },
//   { title: 'Stamp Collection',      amount:  6800, status: 'won',     time: '3 days ago'  }
// ]

// // ─────────────────────────────────────────
// // 5. MOBILE-OPTIMIZED DASHBOARD CONTENT
// function DashboardContent() {
//   const { currentRole, user } = useUserRole()
//   const isSeller   = currentRole === 'seller'
//   const stats      = isSeller ? sellerStats      : buyerStats
//   const activities = isSeller ? sellerActivities : buyerActivities

//   return (
//     <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#09090B] min-h-screen">
//       {/* Mobile-optimized greeting */}
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//           Welcome back, {user?.name || 'User'}! 👋
//         </h1>
//         <p className="text-gray-400 text-sm sm:text-base">
//           Here&apos;s what&apos;s happening with your {currentRole} account today.
//         </p>
//       </div>

//       {/* Mobile-responsive stats grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
//         {stats.map((s, i) => <StatsCard key={i} {...s} />)}
//       </div>

//       {/* Mobile-stacked chart + actions */}
//       <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 mb-6 sm:mb-8">
//         <div className="lg:col-span-2">
//           <PerformanceChart role={currentRole} />
//         </div>
//         <QuickActions role={currentRole} />
//       </div>

//       {/* Mobile-stacked recent activity + tips */}
//       <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
//         <RecentActivity activities={activities} type={currentRole} />
//         <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
//           <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{isSeller ? 'Seller Insights' : 'Bidding Tips'}</h3>
//           {isSeller ? (
//             <ul className="space-y-3 sm:space-y-4 text-sm text-gray-300">
//               <li className="p-3 sm:p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
//                 🎯 Your vintage watches category has the highest conversion rate (94%).
//               </li>
//               <li className="p-3 sm:p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
//                 📈 Sports memorabilia is trending—consider listing similar items.
//               </li>
//               <li className="p-3 sm:p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
//                 💡 Add more detailed photos to boost bidding by ~25%.
//               </li>
//             </ul>
//           ) : (
//             <ul className="space-y-3 sm:space-y-4 text-sm text-gray-300">
//               <li className="p-3 sm:p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
//                 ⚡ Set up proxy bidding to automate your bids.
//               </li>
//               <li className="p-3 sm:p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
//                 🎯 Bid in the last few minutes for better win-rates.
//               </li>
//               <li className="p-3 sm:p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg">
//                 📱 Enable push notifications so you never miss a bid.
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }

// // ─────────────────────────────────────────
// // 6. PAGE COMPONENT
// export default function DashboardPage() {
//   return (
//     <div className="flex min-h-screen bg-[#09090B] mt-15">
//       <Sidebar />         
//       <DashboardContent />
//     </div>
//   )
// }


'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/contexts/RoleContext'
import dynamic from 'next/dynamic'

// ─────────────────────────────────────────
// 1. SAFER SIDEBAR IMPORT (works for both default and named exports, skips SSR)
const Sidebar = dynamic(
  () => import('@/components/Sidebar').then(m => m.default ?? m.Sidebar),
  { ssr: false }
)

// ─────────────────────────────────────────
// 2. PROPER SVG ICONS FOR SIDEBAR AND COMPONENTS
const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const ShoppingBagIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
  </svg>
)

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const TrophyIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const ClipboardListIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
)

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const ChatIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const TagIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

// ─────────────────────────────────────────
// 3. LOADING COMPONENT
function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 4. MOBILE-OPTIMIZED HELPERS (your existing components stay the same)
function StatsCard({ title, value, change, changeType, icon: Icon, color = 'orange' }) {
  const isPositive = changeType === 'positive'
  const colorClasses = {
    orange: 'bg-orange-500/20 text-orange-400',
    blue:   'bg-blue-500/20  text-blue-400',
    green:  'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red:    'bg-red-500/20   text-red-400'
  }

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326] hover:border-orange-500/20 transition-all">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span className="font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{value}</h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{title}</p>
      </div>
      
      {/* Mobile progress indicator */}
      <div className="mt-3 sm:hidden">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div 
            className={`h-1 rounded-full bg-${color}-500 transition-all duration-300`}
            style={{ width: isPositive ? '70%' : '40%' }}
          />
        </div>
      </div>
    </div>
  )
}

function RecentActivity({ activities, type }) {
  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Recent {type === 'seller' ? 'Sales' : 'Bids'}</h3>
      <div className="space-y-3 sm:space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
              {type === 'seller' ? (
                <CurrencyDollarIcon className="w-6 h-6 text-gray-400" />
              ) : (
                <TagIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-gray-400 text-sm">
              No {type === 'seller' ? 'sales' : 'bids'} yet
            </p>
          </div>
        ) : (
          activities.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-[#232326] last:border-b-0 hover:bg-[#232326]/30 transition-colors rounded-lg px-2 sm:px-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-[#232326] flex items-center justify-center flex-shrink-0">
                  <PackageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base truncate">{a.title}</h4>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-semibold text-white text-sm sm:text-base">${a.amount.toLocaleString()}</div>
                <div
                  className={`text-xs px-2 py-1 rounded-full mt-1 ${
                    a.status === 'won'
                      ? 'bg-green-600 text-green-100'
                      : a.status === 'sold'
                      ? 'bg-blue-600 text-blue-100'
                      : a.status === 'bidding'
                      ? 'bg-orange-600 text-orange-100'
                      : 'bg-gray-600 text-gray-100'
                  }`}
                >
                  {a.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function QuickActions({ role }) {
  const seller = [
    { name: 'List New Item', shortName: 'Add Item', href: '/seller/new-auction', icon: PlusIcon, color: 'bg-green-600' },
    { name: 'Manage Listings', shortName: 'Manage', href: '/seller/active-auctions', icon: ClipboardListIcon, color: 'bg-blue-600' },
    { name: 'View Analytics', shortName: 'Analytics', href: '/seller/analytics', icon: ChartBarIcon, color: 'bg-purple-600' },
    { name: 'Messages', shortName: 'Messages', href: '/messages', icon: ChatIcon, color: 'bg-orange-600' },
    { name: 'Admin Panel', shortName: 'Admin', href: '/admin', icon: EyeIcon, color: 'bg-red-600', adminOnly: true }
  ]
  const buyer = [
    { name: 'Browse Auctions', shortName: 'Browse', href: '/auctions', icon: SearchIcon, color: 'bg-blue-600' },
    { name: 'My Watchlist', shortName: 'Watchlist', href: '/watchlist', icon: HeartIcon, color: 'bg-green-600' },
    { name: 'Bid History', shortName: 'Bids', href: '/bids', icon: TagIcon, color: 'bg-purple-600' },
    { name: 'Messages', shortName: 'Messages', href: '/messages', icon: ChatIcon, color: 'bg-orange-600' }
  ]
  const actions = role === 'seller' ? seller : buyer
  const { user } = useUserRole() // Get user from context

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => (window.location.href = a.href)}
            className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-[#232326] hover:bg-[#2a2a2e] active:bg-[#323238] transition-all group touch-manipulation"
          >
            <div className={`p-2 sm:p-2.5 rounded-lg ${a.color} group-hover:scale-110 group-active:scale-105 transition-transform flex-shrink-0`}>
              <a.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="font-medium text-white text-sm sm:text-base block sm:hidden truncate">
                {a.shortName}
              </span>
              <span className="font-medium text-white text-sm sm:text-base hidden sm:block truncate">
                {a.name}
              </span>
            </div>
            
            {/* Arrow indicator */}
            <div className="text-gray-400 group-hover:text-orange-400 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function PerformanceChart({ role }) {
  const [timeframe, setTimeframe] = useState('7d')

  return (
    <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg sm:text-xl font-bold">{role === 'seller' ? 'Sales' : 'Bidding'} Performance</h3>
        </div>
        <div className="flex bg-[#232326] rounded-lg p-1 self-start sm:self-auto">
          {['7d', '30d'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition touch-manipulation ${
                timeframe === period
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white active:bg-[#2a2a2e]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white">$12,845</span>
          <span className="text-green-400 text-sm">+12.5%</span>
        </div>

        {/* Mobile-optimized chart */}
        <div className="h-24 sm:h-32 bg-[#232326]/30 rounded-lg flex items-end justify-around p-2 sm:p-4 overflow-hidden">
          {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
            <div 
              key={i} 
              className="bg-orange-500 hover:bg-orange-400 rounded-t w-6 sm:w-8 transition-all duration-300 cursor-pointer" 
              style={{ height: `${h}%` }}
              title={`Day ${i + 1}: $${(h * 100).toLocaleString()}`}
            />
          ))}
        </div>

        <div className="text-xs sm:text-sm text-gray-400">
          {role === 'seller' ? 'Total Revenue' : 'Total Bids Placed'} – Last 7 days
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 5. MOCK DATA WITH PROPER ICONS
const sellerStats = [
  { title: 'Total Revenue', value: '$12,845', change: '+12.5%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'green' },
  { title: 'Active Listings', value: '23',     change: '+3',     changeType: 'positive', icon: ShoppingBagIcon,   color: 'blue'  },
  { title: 'Total Views',    value: '1,247',  change: '+18.2%', changeType: 'positive', icon: EyeIcon,           color: 'purple'},
  { title: 'Success Rate',   value: '94%',    change: '+2.1%',  changeType: 'positive', icon: TrophyIcon,        color: 'orange'}
]

const buyerStats = [
  { title: 'Items Won',     value: '18',   change: '+3',     changeType: 'positive', icon: TrophyIcon,        color: 'green' },
  { title: 'Active Bids',   value: '7',    change: '+2',     changeType: 'positive', icon: ClockIcon,        color: 'blue'  },
  { title: 'Watchlist Items', value: '34', change: '+8',     changeType: 'positive', icon: HeartIcon,        color: 'purple'},
  { title: 'Total Spent',   value: '$8,920', change: '+24.3%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'orange'}
]

const sellerActivities = [
  { title: 'Vintage Rolex Datejust', amount: 2550, status: 'sold',    time: '2 hours ago' },
  { title: 'KAWS Companion Figure',  amount:  850, status: 'bidding', time: '5 hours ago' },
  { title: 'Air Jordan 1 Chicago',   amount: 1200, status: 'sold',    time: '1 day ago'   },
  { title: 'Harry Potter 1st Edition', amount: 3500, status: 'bidding', time: '2 days ago'}
]

const buyerActivities = [
  { title: 'Vintage Guitar 1961',   amount: 15500, status: 'won',    time: '3 hours ago' },
  { title: 'Mickey Mantle Card',    amount:  4200, status: 'bidding', time: '6 hours ago' },
  { title: 'Abstract Sculpture',    amount:  2800, status: 'outbid',  time: '1 day ago'   },
  { title: 'Stamp Collection',      amount:  6800, status: 'won',     time: '3 days ago'  }
]

// ─────────────────────────────────────────
// 6. MOBILE-OPTIMIZED DASHBOARD CONTENT
function DashboardContent() {
  const { currentRole, user, logout } = useUserRole()
  const isSeller   = currentRole === 'seller'
  const stats      = isSeller ? sellerStats      : buyerStats
  const activities = isSeller ? sellerActivities : buyerActivities

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#09090B] min-h-screen">
      {/* Mobile-optimized greeting with logout */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Here&apos;s what&apos;s happening with your {currentRole} account today.
            </p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium self-start"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile-responsive stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((s, i) => <StatsCard key={i} {...s} />)}
      </div>

      {/* Mobile-stacked chart + actions */}
      <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <PerformanceChart role={currentRole} />
        </div>
        <QuickActions role={currentRole} />
      </div>

      {/* Mobile-stacked recent activity + tips */}
      <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
        <RecentActivity activities={activities} type={currentRole} />
        <div className="bg-[#18181B] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#232326]">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{isSeller ? 'Seller Insights' : 'Bidding Tips'}</h3>
          {isSeller ? (
            <ul className="space-y-3 sm:space-y-4 text-sm text-gray-300">
              <li className="p-3 sm:p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                🎯 Your vintage watches category has the highest conversion rate (94%).
              </li>
              <li className="p-3 sm:p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                📈 Sports memorabilia is trending—consider listing similar items.
              </li>
              <li className="p-3 sm:p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                💡 Add more detailed photos to boost bidding by ~25%.
              </li>
            </ul>
          ) : (
            <ul className="space-y-3 sm:space-y-4 text-sm text-gray-300">
              <li className="p-3 sm:p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                ⚡ Set up proxy bidding to automate your bids.
              </li>
              <li className="p-3 sm:p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                🎯 Bid in the last few minutes for better win-rates.
              </li>
              <li className="p-3 sm:p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                📱 Enable push notifications so you never miss a bid.
              </li>
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────
// 7. PAGE COMPONENT WITH AUTHENTICATION
export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useUserRole()

  // ✅ FIXED: Added authentication check
  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Dashboard auth check:', {
        loading,
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!localStorage.getItem('auth-token'),
        hasUserData: !!localStorage.getItem('user-data')
      })

      // Wait for loading to complete
      if (!loading) {
        const token = localStorage.getItem('auth-token')
        const userData = localStorage.getItem('user-data')
        
        if (!token || !userData || !isAuthenticated) {
          console.log('❌ Authentication failed, redirecting to login...')
          router.push('/login')
          return
        }
        
        console.log('✅ User authenticated, showing dashboard')
      }
    }

    checkAuth()
  }, [loading, isAuthenticated, user, router])

  // ✅ FIXED: Show loading while checking auth
  if (loading) {
    return <LoadingDashboard />
  }

  // ✅ FIXED: Don't render dashboard if not authenticated
  if (!isAuthenticated || !user) {
    return <LoadingDashboard />
  }

  return (
    <div className="flex min-h-screen bg-[#09090B] mt-15">
      <Sidebar />         
      <DashboardContent />
    </div>
  )
}
