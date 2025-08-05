import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TeamMemberCard from '../../components/TeamMemberCard';
import FeatureCard from '../../components/FeatureCard';
import {
  CommunityIcon,
  TrustIcon,
  InnovationIcon,
  DualRoleIcon
} from '../../components/UiIcon';
import Link from 'next/link';

export const metadata = {
  title: 'About | Rock the Auction',
  description: 'Learn how our community-driven auction platform empowers anyone to buy & sell unique treasures.',
};

export default function AboutPage() {
  // ---- STATIC DATA (replace anytime) ----
  const coreValues = [
    { title: 'Trust & Security', Icon: TrustIcon, description: 'Dual-layer verification, escrow payments & AI counterfeit detection keep every transaction safe.' },
    { title: 'Community First',  Icon: CommunityIcon, description: 'Buyers and sellers connect in live chats, forums and events—because stories make collectibles priceless.' },
    { title: 'Innovation',       Icon: InnovationIcon, description: 'Real-time bidding, instant translations, and predictive pricing powered by GPT-4o keep us ahead of the curve.' },
    { title: 'Dual-Role Powered',Icon: DualRoleIcon, description: 'Switch from collector to seller in one click. Everyone can curate—and cash-in on—their passions.' },
  ];

  const team = [
    { name:'Alicia Gomez', role:'CEO / Co-Founder', img:'/about/team-alice.jpg',  bio:'Marketplace strategist & vintage-camera addict.'},
    { name:'Dev Patel',    role:'CTO',              img:'/about/team-dev.jpg',    bio:'Full-stack architect and auction sniper.'},
    { name:'Marcus R.',    role:'Head of Product',  img:'/about/team-marcus.jpg', bio:'Data-driven builder with a sneaker habit.'},
    { name:'Elena K.',     role:'Community Lead',   img:'/about/team-elena.jpg',  bio:'Turning collectors into lifelong friends.'},
  ];

  const features = [
    { title:'Smart Bidding', description:'Auto-bid, snipe guard & bidder analytics keep the thrill fair.', stats:'+30% engagement', Icon: InnovationIcon },
    { title:'AI Authentication', description:'Vision-AI + human experts verify every item.', stats:'99.2% accuracy', Icon: TrustIcon },
    { title:'Mobile-First', description:'Bid or sell anywhere with blazing-fast PWA.', stats:'50% of all actions', Icon: CommunityIcon },
    { title:'Seller Insights', description:'Dashboard metrics to price, promote & profit.', stats:'+18% higher sell-through', Icon: DualRoleIcon },
  ];

  const impactStats = [
    { number:'500K+', label:'Members',      blurb:'active buyers & sellers' },
    { number:'2.3M+', label:'Lots Sold',    blurb:'unique items re-homed'  },
    { number:'98.7%', label:'Success Rate', blurb:'auctions close w/ payment'},
    { number:'190+',  label:'Countries',    blurb:'global reach'           },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <img
          src="../../assets/heroimage.jpg"
          alt="Auction hero"
          className="w-full h-[420px] object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-lg">
            Where Collectors Meet Curators
          </h1>
          <p className="max-w-3xl mt-4 text-gray-300">
            Rock the Auction turns passion into opportunity. Bid on treasures,
            list your own finds, and join a community built on trust.
          </p>
          <div className="flex gap-4 mt-8 flex-col sm:flex-row">
            <Link href="/auctions" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold">
              Browse Live Auctions
            </Link>
            <Link href="/seller/new-auction" className="px-8 py-3 bg-transparent border-2 border-orange-500 hover:bg-orange-500 rounded-lg font-semibold">
              List Your Item
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <p className="text-lg text-gray-300 leading-relaxed text-center">
          Rock the Auction empowers anyone to be both&nbsp;
          <span className="text-orange-400 font-semibold">buyer</span> and&nbsp;
          <span className="text-orange-400 font-semibold">seller</span>, unlocking hidden
          value in the world’s collections while guaranteeing authenticity,
          security, and excitement on every bid.
        </p>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreValues.map(v => (
            <FeatureCard key={v.title} {...v} />
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Marketplace Impact</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {impactStats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-orange-400">{s.number}</div>
              <div className="text-lg font-semibold">{s.label}</div>
              <div className="text-xs text-gray-400">{s.blurb}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Platform Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* Dual-Role Illustration */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
        <img
          src="../../assets/buyer&seller.png"
          alt="Buyer and seller roles diagram"
          className="w-full lg:w-1/2 rounded-lg shadow-lg"
        />
        <div className="lg:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold">Buy Today, Sell Tomorrow</h2>
          <p className="text-gray-300">
            On Rock the Auction, your role is fluid. Snag rare finds from other
            enthusiasts, then relist items from your collection— all under one
            secure account.
          </p>
          <ul className="list-disc pl-6 text-gray-400 space-y-1">
            <li>No separate seller signup—switch in one click</li>
            <li>Unified wallet tracks balances from both roles</li>
            <li>Seller analytics recommend best listing times</li>
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map(t => (
            <TeamMemberCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Rock the Auction?</h2>
        <p className="text-gray-400 mb-8 max-w-3xl mx-auto">
          Join thousands of collectors and creators redefining how treasures
          change hands. Whether you’re here to bid or sell, your next story
          starts now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auctions" className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold">
            Browse Auctions
          </Link>
          <Link href="/auth/register" className="bg-transparent border-2 border-orange-500 hover:bg-orange-500 px-8 py-3 rounded-lg font-semibold">
            Create an Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
