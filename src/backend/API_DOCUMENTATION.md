# Backend API Documentation

## Overview

Backend APIs for catalogues, lots, and auctions have been organized in a structured backend folder.

## Folder Structure

```
src/backend/
├── api/                    # API route handlers
│   ├── catalogues/        # Catalogue API handlers
│   ├── lots/              # Lot API handlers
│   └── auctions/          # Auction API handlers
├── controllers/           # Business logic controllers
│   ├── catalogueController.js
│   ├── lotController.js
│   └── auctionController.js
├── utils/                 # Utility functions
│   ├── helpers.js         # Common helpers (error handling, pagination)
│   └── validators.js      # Validation utilities
├── middleware/            # Custom middleware (for future use)
├── services/              # Business logic services (for future use)
└── config/                # Configuration files (for future use)
```

## API Endpoints

### Catalogues

**GET /api/catalogues**
- Get all catalogues with optional filtering
- Query params: `status`, `createdBy`, `page`, `limit`
- Returns: `{ success: true, catalogues: [], pagination: {} }`

**POST /api/catalogues**
- Create a new catalogue
- Body: `{ title, description, coverImage, auctionDate, location, status, createdBy }`
- Returns: `{ success: true, message: '...', catalogue: {} }`

### Lots

**GET /api/lots**
- Get all lots with optional filtering
- Query params: `catalogue`, `auction`, `status`, `category`, `page`, `limit`
- Returns: `{ success: true, lots: [], pagination: {} }`

**POST /api/lots**
- Create a new lot
- Body: `{ lotNumber, title, description, images, category, condition, estimateLow, estimateHigh, startingBid, reservePrice, catalogue, auctionId, ... }`
- Returns: `{ success: true, message: '...', lot: {} }`

### Auctions

**GET /api/auctions**
- Get all auctions with optional filtering
- Query params: `status`, `active`, `category`, `createdBy`, `page`, `limit`
- Returns: `{ success: true, auctions: [], pagination: {} }`

**POST /api/auctions**
- Create a new auction
- Body: `{ title, description, startTime, endTime, category, images, startingBid, reservePrice, ... }`
- Returns: `{ success: true, message: '...', auction: {} }`

**GET /api/auctions/active**
- Get only active auctions (not ended, status: live or scheduled)
- Query params: `category`, `limit`
- Returns: `{ success: true, auctions: [], count: number }`

## Usage Example

```javascript
// Frontend usage
const response = await fetch('/api/catalogues', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Fine Art Auction',
    auctionDate: '2024-12-15T10:00:00Z',
    location: 'New York, NY',
    status: 'draft'
  })
})

const data = await response.json()
```

## Validation

All APIs include comprehensive validation:
- Required fields
- Data type validation
- Business rule validation (e.g., estimateLow <= estimateHigh)
- Status enum validation
- Date format validation

## Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error






