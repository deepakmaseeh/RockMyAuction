# Auction Catalog Module Documentation

## Overview

This is a comprehensive Auction Catalog + Lot Management module built for Next.js with MongoDB/Mongoose. It includes admin interfaces for managing auctions and lots, CSV import/export, AI-assisted description generation, and public catalog browsing.

## Features

### Admin Features
- ✅ Create and manage auctions
- ✅ Comprehensive lot builder with form
- ✅ Bulk actions (publish, feature, move, renumber)
- ✅ CSV import/export with validation
- ✅ AI-assisted description generation from images
- ✅ Media manager with drag-and-drop reordering
- ✅ Event logging for audit trail

### Public Features
- ✅ Catalog browsing with filters
- ✅ Search functionality
- ✅ Lot detail pages
- ✅ Responsive mobile-first design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB with Mongoose
- **AI**: Google Generative AI (Gemini)
- **Validation**: Custom validators (zod optional)
- **Styling**: TailwindCSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 3. Seed Database

```bash
node scripts/seed.js
```

This creates:
- 1 sample auction
- 5 sample lots with images

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── auctions/
│   │       ├── page.js              # Auction list
│   │       ├── [id]/
│   │       │   ├── page.js         # Auction detail
│   │       │   └── lots/
│   │       │       └── new/
│   │       │           └── page.js  # Create lot
│   │       └── new/
│   │           └── page.js          # Create auction
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auctions/            # Auction CRUD
│   │   │   └── lots/
│   │   │       ├── bulk/            # Bulk actions
│   │   │       └── import/          # CSV import/export
│   │   └── ai/
│   │       └── generateLotDraft/   # AI description generation
│   └── auctions/
│       └── [slug]/                  # Public catalog pages
├── components/
│   └── admin/
│       ├── LotTable.js              # Lot management table
│       ├── LotForm.js               # Lot creation/edit form
│       ├── MediaManager.js          # Image upload/reorder
│       ├── AIAssistPanel.js         # AI generation UI
│       └── CSVImportWizard.js       # CSV import wizard
└── lib/
    ├── models/
    │   ├── Auction.js               # Auction model
    │   ├── Lot.js                   # Lot model
    │   ├── LotImage.js              # LotImage model
    │   ├── EventLog.js              # Audit log model
    │   └── Consignor.js             # Consignor model
    ├── validators/
    │   └── lot.js                   # Validation utilities
    └── utils/
        └── csv.js                   # CSV parsing utilities
```

## API Routes

### Admin Routes

#### Auctions
- `GET /api/admin/auctions` - List all auctions
- `POST /api/admin/auctions` - Create auction
- `GET /api/admin/auctions/[id]` - Get auction
- `PUT /api/admin/auctions/[id]` - Update auction
- `DELETE /api/admin/auctions/[id]` - Delete auction

#### Lots
- `GET /api/admin/auctions/[id]/lots` - List lots for auction
- `POST /api/admin/auctions/[id]/lots` - Create lot
- `POST /api/admin/lots/bulk` - Bulk actions
- `POST /api/admin/lots/import` - Import CSV
- `GET /api/admin/lots/export` - Export CSV

#### AI
- `POST /api/ai/generateLotDraft` - Generate lot description from images

## Usage

### Creating an Auction

1. Navigate to `/admin/auctions`
2. Click "New Auction"
3. Fill in:
   - Title
   - Slug (URL-friendly identifier)
   - Description
   - Start/End dates
   - Buyer's premium percentage
   - Terms (HTML)
4. Save

### Creating a Lot

1. Navigate to auction detail page
2. Click "New Lot"
3. Fill in lot details:
   - Lot number (must be unique per auction)
   - Title (max 80 chars)
   - Description
   - Pricing (estimates, starting bid, reserve)
   - Category
   - Attributes (key-value pairs)
4. Upload images using Media Manager
5. Use AI Assist to generate description from images
6. Save

### CSV Import

1. Prepare CSV file with columns:
   - `lotNumber` (required)
   - `title` (required)
   - `description`
   - `category`
   - `condition`
   - `quantity`
   - `estimateLow`
   - `estimateHigh`
   - `reservePrice`
   - `startingBid`
   - `featured` (true/false)
   - `attributes` (JSON string)
   - `images` (semicolon-separated URLs)

2. Navigate to auction detail page
3. Click "Import CSV"
4. Select file and validate
5. Review preview and import

### CSV Export

1. Navigate to auction detail page
2. Click "Export CSV"
3. Download file with all lots

### AI-Assisted Description

1. Upload images to lot form
2. Click "AI Assist" button
3. Optionally provide baseline title/category
4. Click "Generate Draft"
5. Review generated content
6. Click "Apply to Form" to populate fields

## Models

### Auction
- `slug` - Unique URL identifier
- `title` - Auction title
- `description` - Description
- `startAt` / `endAt` - Auction dates
- `timezone` - Timezone
- `buyerPremiumPct` - Buyer's premium percentage
- `termsHtml` - Terms and conditions (HTML)
- `status` - draft, scheduled, live, closed

### Lot
- `auctionId` - Parent auction
- `lotNumber` - Unique lot number per auction
- `title` - Lot title (max 80 chars)
- `subtitle` - Subtitle
- `description` - Detailed description
- `conditionReport` - Condition report
- `category` - Category
- `attributes` - Key-value attributes (JSON)
- `quantity` - Quantity
- `estimateLow` / `estimateHigh` - Estimate range
- `startingBid` - Starting bid
- `reservePrice` - Reserve price
- `status` - draft, published, sold, passed
- `featured` - Featured flag
- `seoSlug` - SEO-friendly URL slug
- `videoUrl` - Video URL

### LotImage
- `lotId` - Parent lot
- `url` - Image URL
- `alt` - Alt text
- `sortOrder` - Display order

### EventLog
- `entityType` - Entity type (Auction, Lot, etc.)
- `entityId` - Entity ID
- `action` - Action type
- `actorId` - User who performed action
- `data` - Action data
- `previousData` - Previous state (for updates)

## Validation

### Lot Number Format
- Supports numeric with optional alpha suffix (e.g., "27", "27A")
- Must be unique within auction
- Validated with regex: `/^(\d+)([A-Za-z]*)$/`

### Pricing Rules
- `estimateHigh >= estimateLow`
- `reservePrice >= startingBid` (if both provided)

### Title Limits
- Max 80 characters
- SEO slug auto-generated from title

## Bulk Actions

Supported bulk actions:
- `publish` - Publish lots
- `unpublish` - Unpublish lots
- `feature` - Feature lots
- `unfeature` - Unfeature lots
- `move` - Move to different auction
- `renumber` - Renumber lots

## AI Generation

The AI generator uses Google Gemini Vision API to:
- Analyze images
- Generate titles, descriptions, attributes
- Suggest estimates
- Provide condition reports

**Note**: Uses cautious language for uncertain claims. Never guarantees authenticity.

## Mobile-First Design

All components are responsive:
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: Multi-column layouts

## Performance

- Indexed database queries
- Pagination for large datasets
- Image optimization with Next.js Image
- Lazy loading for media

## Security

- Admin routes should be protected (add middleware)
- Input validation on all API routes
- Sanitized HTML in descriptions
- Secure file upload handling

## Testing

Run seed script to create test data:
```bash
node scripts/seed.js
```

## Next Steps

1. Add authentication middleware for admin routes
2. Implement public catalog pages (`/auctions/[slug]`)
3. Add search and filtering
4. Implement bidding system
5. Add PDF export functionality
6. Enhance AI prompts for better results
7. Add unit tests
8. Add E2E tests

## Troubleshooting

### MongoDB Connection Issues
- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running
- Check connection string format

### AI Generation Fails
- Verify `GOOGLE_AI_API_KEY` is set
- Check API quota/limits
- Review error logs

### CSV Import Errors
- Check CSV format matches expected columns
- Validate data types (numbers, booleans)
- Review validation errors in preview

## License

[Your License Here]





