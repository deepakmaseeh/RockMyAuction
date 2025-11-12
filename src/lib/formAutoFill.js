// Form Auto-Fill Utilities
// This allows chatbot to interact with forms and auto-fill fields

export const formActions = {
  fillCatalogueForm: (data) => {
    window.dispatchEvent(new CustomEvent('fill-catalogue-form', { detail: data }))
  },
  fillLotForm: (data) => {
    window.dispatchEvent(new CustomEvent('fill-lot-form', { detail: data }))
  },
  clearForm: (formType) => {
    window.dispatchEvent(new CustomEvent('clear-form', { detail: { formType } }))
  }
}

// Sample data generators
export const sampleData = {
  catalogue: {
    title: "Spring Fine Art & Antiques Auction",
    description: "A curated collection of fine art, antiques, and collectibles from renowned estates. This auction features rare paintings, vintage furniture, and unique collectibles spanning several centuries.",
    coverImage: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
    auctionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 7 days from now
    location: "New York City, NY",
    status: "draft"
  },
  lot: {
    lotNumber: "001",
    title: "Vintage Rolex Submariner Watch",
    description: "Circa 1970s Rolex Submariner reference 5513. Features original bezel, crown, and dial. Excellent condition with original bracelet. Comes with original box and papers.",
    images: [
      "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800"
    ],
    category: "Jewelry & Watches",
    condition: "excellent",
    estimatedValue: 15000,
    startingPrice: 12000,
    reservePrice: 14000,
    provenance: "Originally purchased from authorized dealer in 1972. Single owner until 2024.",
    dimensions: {
      height: 2,
      width: 4,
      depth: 1,
      unit: "cm"
    },
    weight: {
      value: 0.15,
      unit: "kg"
    },
    status: "draft",
    metadata: {
      tags: ["vintage", "luxury", "collectible", "rolex"],
      notes: "Verified authentic. Recent service completed."
    }
  }
}








