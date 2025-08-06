import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TeamMemberCard from '@/components/TeamMemberCard'
import FeatureCard from '@/components/FeatureCard'
import {
  CommunityIcon,
  TrustIcon,
  InnovationIcon,
  DualRoleIcon
} from '@/components/UiIcon'
import Link from 'next/link'

export const metadata = {
  title: 'About | Rock the Auction',
  description: 'Learn how our community-driven auction platform empowers anyone to buy & sell unique treasures.',
}

export default function AboutPage() {
  // ---- STATIC DATA (replace anytime) ----
  const coreValues = [
    { title: 'Trust & Security', Icon: TrustIcon, description: 'Dual-layer verification, escrow payments & AI counterfeit detection keep every transaction safe.' },
    { title: 'Community First',  Icon: CommunityIcon, description: 'Buyers and sellers connect in live chats, forums and events—because stories make collectibles priceless.' },
    { title: 'Innovation',       Icon: InnovationIcon, description: 'Real-time bidding, instant translations, and predictive pricing powered by GPT-4o keep us ahead of the curve.' },
    { title: 'Dual-Role Powered',Icon: DualRoleIcon, description: 'Switch from collector to seller in one click. Everyone can curate—and cash-in on—their passions.' },
  ]

  const team = [
    { name:'Alicia Gomez', role:'CEO / Co-Founder', img:'/about/team-alice.jpg',  bio:'Marketplace strategist & vintage-camera addict.'},
    { name:'Dev Patel',    role:'CTO',              img:'/about/team-dev.jpg',    bio:'Full-stack architect and auction sniper.'},
    { name:'Marcus R.',    role:'Head of Product',  img:'/about/team-marcus.jpg', bio:'Data-driven builder with a sneaker habit.'},
    { name:'Elena K.',     role:'Community Lead',   img:'/about/team-elena.jpg',  bio:'Turning collectors into lifelong friends.'},
  ]

  const features = [
    { title:'Smart Bidding', description:'Auto-bid, snipe guard & bidder analytics keep the thrill fair.', stats:'+30% engagement', Icon: InnovationIcon },
    { title:'AI Authentication', description:'Vision-AI + human experts verify every item.', stats:'99.2% accuracy', Icon: TrustIcon },
    { title:'Mobile-First', description:'Bid or sell anywhere with blazing-fast PWA.', stats:'50% of all actions', Icon: CommunityIcon },
    { title:'Seller Insights', description:'Dashboard metrics to price, promote & profit.', stats:'+18% higher sell-through', Icon: DualRoleIcon },
  ]

  const impactStats = [
    { number:'500K+', label:'Members',      blurb:'active buyers & sellers' },
    { number:'2.3M+', label:'Lots Sold',    blurb:'unique items re-homed'  },
    { number:'98.7%', label:'Success Rate', blurb:'auctions close w/ payment'},
    { number:'190+',  label:'Countries',    blurb:'global reach'           },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-white">
      {/* Use Navbar Component */}
      <Navbar />

      {/* Hero Section - Enhanced Mobile Optimization */}
      <section className="relative w-full">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/heroimage.jpg"
            alt="Auction hero"
            className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#09090B]" />
        </div>

        {/* Content */}
        <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-[90%] sm:max-w-2xl lg:max-w-4xl mx-auto text-center space-y-6">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                Where Collectors Meet Curators
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-prose mx-auto">
              Rock the Auction turns passion into opportunity. Bid on treasures,
              list your own finds, and join a community built on trust.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                href="/auctions" 
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 
                         rounded-lg font-semibold text-base sm:text-lg transition-colors 
                         focus:ring-2 focus:ring-orange-500/50 focus:outline-none
                         shadow-lg hover:shadow-orange-500/20"
              >
                Browse Live Auctions
              </Link>
              <Link 
                href="/seller/new-auction" 
                className="w-full sm:w-auto px-6 py-3 bg-black/30 hover:bg-black/40 
                         border-2 border-orange-500 rounded-lg font-semibold text-base sm:text-lg 
                         transition-all hover:scale-[1.02] focus:ring-2 focus:ring-orange-500/50 
                         focus:outline-none backdrop-blur-sm"
              >
                List Your Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission - Mobile Optimized */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Our Mission</h2>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center">
          Rock the Auction empowers anyone to be both&nbsp;
          <span className="text-orange-400 font-semibold">buyer</span> and&nbsp;
          <span className="text-orange-400 font-semibold">seller</span>, unlocking hidden
          value in the world's collections while guaranteeing authenticity,
          security, and excitement on every bid.
        </p>
      </section>

      {/* Core Values - Mobile Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {coreValues.map(v => (
            <FeatureCard key={v.title} {...v} />
          ))}
        </div>
      </section>

      {/* Impact Stats - Mobile Responsive Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">Marketplace Impact</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {impactStats.map(s => (
            <div key={s.label} className="text-center p-3 sm:p-4 bg-[#18181B] rounded-lg border border-[#232326]">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">
                {s.number}
              </div>
              <div className="text-sm sm:text-base lg:text-lg font-semibold mb-1">
                {s.label}
              </div>
              <div className="text-xs text-gray-400 leading-tight">
                {s.blurb}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features - Mobile Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">Platform Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {features.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* Dual-Role Illustration - Mobile Stack */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
          <div className="w-full lg:w-1/2">
            <img
              src="/assets/buyer&seller.png"
              alt="Buyer and seller roles diagram"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center lg:text-left">
              Buy Today, Sell Tomorrow
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed text-center lg:text-left">
              On Rock the Auction, your role is fluid. Snag rare finds from other
              enthusiasts, then relist items from your collection— all under one
              secure account.
            </p>
            <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-gray-400 space-y-1 text-left">
              <li>No separate seller signup—switch in one click</li>
              <li>Unified wallet tracks balances from both roles</li>
              <li>Seller analytics recommend best listing times</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team - Mobile Responsive Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {team.map(t => (
            <TeamMemberCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* CTA - Mobile Optimized */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Rock the Auction?</h2>
        <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
          Join thousands of collectors and creators redefining how treasures
          change hands. Whether you're here to bid or sell, your next story
          starts now.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
          <Link 
            href="/auctions" 
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors touch-manipulation"
          >
            Browse Auctions
          </Link>
          <Link 
            href="/signup" 
            className="bg-transparent border-2 border-orange-500 hover:bg-orange-500 active:bg-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors touch-manipulation"
          >
            Create an Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
