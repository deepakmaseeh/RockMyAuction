export const mockAuctions = [
  {
    id: 1,
    title: "Vintage Rolex Datejust Third Hand",
    image: "/auctions/watch1.jpg",
    currentBid: 2550,
    timeLeft: "2h 30m",
    status: "LIVE NOW",
    bids: 45,
    seller: "LuxuryTimepieces",
    category: "Watches",
    endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: "KAWS Companion (Flayed) Limited Edition",
    image: "/auctions/kaws.jpg",
    currentBid: 850,
    timeLeft: "4h 15m",
    status: "LIVE NOW",
    bids: 22,
    seller: "ArtCollective",
    category: "Art",
    endTime: new Date(Date.now() + 4.25 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: "Air Jordan 1 Retro High OG Chicago",
    image: "/auctions/jordan.jpg",
    currentBid: 1200,
    timeLeft: "1h 45m",
    status: "LIVE NOW",
    bids: 67,
    seller: "SneakerVault",
    category: "Sneakers",
    endTime: new Date(Date.now() + 1.75 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: "First Edition Harry Potter & Philosopher's Stone",
    image: "/auctions/book.jpg",
    currentBid: 3500,
    timeLeft: "6h 20m",
    status: "LIVE NOW",
    bids: 38,
    seller: "RareBooksCollector",
    category: "Books",
    endTime: new Date(Date.now() + 6.33 * 60 * 60 * 1000)
  },
  {
    id: 5,
    title: "1960 Topps Mickey Mantle Baseball Card",
    image: "/auctions/baseball.jpg",
    currentBid: 4200,
    timeLeft: "3h 10m",
    status: "LIVE NOW",
    bids: 89,
    seller: "SportsCardsDepot",
    category: "Sports Cards",
    endTime: new Date(Date.now() + 3.17 * 60 * 60 * 1000)
  },
  {
    id: 6,
    title: "Vintage 1961 Fender Stratocaster",
    image: "/auctions/guitar.jpg",
    currentBid: 15500,
    timeLeft: "8h 45m",
    status: "LIVE NOW",
    bids: 156,
    seller: "VintageGuitars",
    category: "Musical Instruments",
    endTime: new Date(Date.now() + 8.75 * 60 * 60 * 1000)
  },
  {
    id: 7,
    title: "Abstract Kinetic Sculpture by Arya",
    image: "/auctions/sculpture.jpg",
    currentBid: 2800,
    timeLeft: "5h 30m",
    status: "LIVE NOW",
    bids: 34,
    seller: "ModernArtStudy",
    category: "Sculpture",
    endTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000)
  },
  {
    id: 8,
    title: "Penny Black 1840 Stamp (Mint Condition)",
    image: "/auctions/stamp.jpg",
    currentBid: 6800,
    timeLeft: "12h 15m",
    status: "LIVE NOW",
    bids: 92,
    seller: "PhilatelyCorner",
    category: "Stamps",
    endTime: new Date(Date.now() + 12.25 * 60 * 60 * 1000)
  }
]

export const featuredAuction = {
  id: 99,
  title: "The Midnight Chronograph",
  description: "This limited edition timepiece showcases exceptional craftsmanship and timeless design. Don't miss your chance to own a piece of history.",
  image: "/auctions/featured-watch.jpg",
  currentBid: 12500,
  timeLeft: "4h 32m",
  bids: 234,
  status: "FEATURED"
}
