import FAQAccordion from './FAQAccordion'
import GuideCard from './GuideCard'
import SupportForm from './SupportForm'

const faq = [
  { q: "How do I place a bid on an item?", a: "Simply navigate to the auction, enter your bid, and submit." },
  { q: "What payment methods are accepted?", a: "We accept credit cards, PayPal, and wire transfers." },
  { q: "Can I cancel a bid after placing it?", a: "Bids are binding. Please contact support for urgent cases." },
  { q: "How do I track my winning bids?", a: "Go to your Dashboard > Won Auctions." },
  { q: "What is the process for item delivery after winning?", a: "We connect you with the seller for secure shipping and tracking." },
  { q: "How do I verify the authenticity of an item?", a: "Review our Verification Guide and ask for certification if available." },
  { q: "I forgot my password, how can I reset it?", a: "Use the 'Forgot Password' link on the login page." },
  { q: "Are there any fees for selling items on Rock the Auction?", a: "A small commission fee is applied to successful sales." },
]

const guides = [
  {
    title: "Understanding Bid Increments",
    description: "Learn how the bidding ladder works and bid more efficiently.",
    image: "/help_bid.jpg"
  },
  {
    title: "Maximizing Your Wallet Balance",
    description: "Tips and tricks for funding your wallet and getting the most value.",
    image: "/help_wallet.jpg"
  },
  {
    title: "Selling Your Collectibles",
    description: "Step-by-step guide by top sellers on listing for success.",
    image: "/help_selling.jpg"
  },
  {
    title: "Authenticity Verification Process",
    description: "How our experts process and review submissions for authenticity.",
    image: "/help_auth.jpg"
  },
  {
    title: "Navigating Live Auctions",
    description: "All you need to know to participate in live auctions and win!",
    image: "/help_live.jpg"
  }
]

const helpfulLinks = [
  { label: "Terms of Service", url: "#" },
  { label: "Privacy Policy", url: "#" },
  { label: "Shipping Information", url: "#" },
  { label: "Dispute Resolution", url: "#" },
  { label: "Contact the University", url: "#" }
]

export default function HelpCenterContent() {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Main help content */}
      <div className="xl:col-span-3">
        <h1 className="text-3xl font-bold mb-8 text-center xl:text-left">How Can We Help You?</h1>
        
        {/* FAQ */}
        <div className="mb-10 bg-[#18181B] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          <FAQAccordion items={faq} />
        </div>

        {/* Guides & Tutorials */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Guides & Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guides.map((g) => (
              <GuideCard key={g.title} {...g} />
            ))}
          </div>
        </div>

        {/* Support Form */}
        <div className="mb-4 bg-[#18181B] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
          <SupportForm />
        </div>
      </div>
      {/* Helpful links sidebar */}
      <aside className="xl:col-span-1">
        <div className="bg-[#18181B] rounded-xl p-6 mb-8">
          <h3 className="font-bold mb-2 text-base">Helpful Links</h3>
          <ul className="space-y-2">
            {helpfulLinks.map((l) => (
              <li key={l.label}>
                <a href={l.url} className="text-orange-400 hover:underline">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
