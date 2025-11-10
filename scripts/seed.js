import connectDB from '@/lib/db';
import Auction from '@/lib/models/Auction';
import Lot from '@/lib/models/Lot';
import LotImage from '@/lib/models/LotImage';

/**
 * Seed script to create sample auction data
 * Run with: node scripts/seed.js
 */

const sampleLots = [
  {
    lotNumber: '1',
    title: 'Vintage Rolex Submariner Watch',
    subtitle: '1960s Professional Diver',
    description: 'A classic Rolex Submariner from the 1960s, featuring a stainless steel case, rotating bezel, and original oyster bracelet. This iconic timepiece represents the pinnacle of dive watch design.',
    category: 'Watches',
    estimateLow: 8000,
    estimateHigh: 12000,
    startingBid: 7000,
    reservePrice: 7500,
    featured: true,
    attributes: {
      maker: 'Rolex',
      model: 'Submariner',
      era: '1960s',
      material: 'Stainless Steel',
      condition: 'Excellent'
    },
    images: ['https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Rolex+Watch']
  },
  {
    lotNumber: '2',
    title: 'Signed Picasso Lithograph',
    subtitle: 'Limited Edition Print',
    description: 'A beautiful lithograph signed by Pablo Picasso, featuring his distinctive cubist style. Part of a limited edition series from the 1950s.',
    category: 'Art',
    estimateLow: 15000,
    estimateHigh: 25000,
    startingBid: 12000,
    reservePrice: 14000,
    featured: true,
    attributes: {
      maker: 'Pablo Picasso',
      era: '1950s',
      material: 'Paper',
      condition: 'Very Good'
    },
    images: ['https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Picasso+Print']
  },
  {
    lotNumber: '3',
    title: 'Antique Persian Rug',
    subtitle: '19th Century Handwoven',
    description: 'A stunning handwoven Persian rug from the 19th century, featuring intricate patterns and rich colors. Excellent condition with minor wear consistent with age.',
    category: 'Decorative Arts',
    estimateLow: 5000,
    estimateHigh: 8000,
    startingBid: 4000,
    reservePrice: 4500,
    attributes: {
      era: '19th Century',
      material: 'Wool',
      condition: 'Good',
      dimensions: '200 x 300 cm'
    },
    images: ['https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Persian+Rug']
  },
  {
    lotNumber: '4',
    title: 'Vintage Hermès Birkin Bag',
    subtitle: 'Black Leather',
    description: 'A highly sought-after Hermès Birkin bag in black leather with gold hardware. Complete with original box, dust bag, and lock/key.',
    category: 'Fashion',
    estimateLow: 12000,
    estimateHigh: 18000,
    startingBid: 10000,
    reservePrice: 11000,
    featured: true,
    attributes: {
      maker: 'Hermès',
      material: 'Leather',
      condition: 'Excellent'
    },
    images: ['https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Hermes+Bag']
  },
  {
    lotNumber: '5',
    title: 'Rare First Edition Book',
    subtitle: 'Shakespeare Complete Works',
    description: 'A rare first edition of Shakespeare\'s complete works from the 17th century. Bound in original leather with gilt decorations.',
    category: 'Books',
    estimateLow: 3000,
    estimateHigh: 5000,
    startingBid: 2500,
    reservePrice: 2800,
    attributes: {
      era: '17th Century',
      material: 'Paper, Leather',
      condition: 'Good'
    },
    images: ['https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Shakespeare+Book']
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Create auction
    const auction = new Auction({
      slug: 'spring-auction-2024',
      title: 'Spring Fine Arts & Collectibles Auction',
      description: 'A curated selection of fine art, watches, jewelry, and collectibles.',
      startAt: new Date('2024-04-15T10:00:00Z'),
      endAt: new Date('2024-04-20T18:00:00Z'),
      timezone: 'UTC',
      buyerPremiumPct: 15,
      termsHtml: '<p>Terms and conditions apply. Buyer\'s premium: 15%</p>',
      status: 'scheduled'
    });

    await auction.save();
    console.log(`Created auction: ${auction.title}`);

    // Create lots
    const createdLots = [];
    for (const lotData of sampleLots) {
      const lot = new Lot({
        ...lotData,
        auctionId: auction._id,
        status: 'published',
        seoSlug: lotData.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      });

      await lot.save();
      createdLots.push(lot);

      // Add images
      if (lotData.images && lotData.images.length > 0) {
        const lotImages = lotData.images.map((url, index) => ({
          lotId: lot._id,
          url,
          sortOrder: index,
          alt: lotData.title
        }));

        await LotImage.insertMany(lotImages);
      }

      console.log(`Created lot: ${lot.lotNumber} - ${lot.title}`);
    }

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`- Created 1 auction`);
    console.log(`- Created ${createdLots.length} lots`);
    console.log(`\nAuction ID: ${auction._id}`);
    console.log(`Auction slug: ${auction.slug}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

export default seed;






