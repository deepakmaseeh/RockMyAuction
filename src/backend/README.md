# Backend API Structure

This directory contains backend API logic, controllers, services, and utilities.

## Directory Structure

```
backend/
├── .env              # Environment variables (not committed to git)
├── .env.example      # Example environment variables template
├── api/              # API route handlers (Next.js API routes import from here)
│   ├── catalogues/   # Catalogue API handlers
│   ├── lots/         # Lot API handlers
│   └── auctions/     # Auction API handlers
├── controllers/      # Request handlers and business logic
│   ├── catalogueController.js
│   ├── lotController.js
│   └── auctionController.js
├── services/         # Business logic services
│   ├── catalogueService.js
│   ├── lotService.js
│   └── auctionService.js
├── middleware/       # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── utils/            # Utility functions
│   ├── validators.js
│   ├── formatters.js
│   └── helpers.js
└── config/           # Configuration files
    ├── index.js      # Main configuration (exports all env vars)
    ├── database.js   # Database connection management
    └── constants.js
```

## Environment Variables

### Important: Next.js Environment Variable Loading

Next.js automatically loads `.env` files from the **project root** (not from subdirectories). The `.env` file in `src/backend/.env` has been created for organizational purposes, but you should also ensure these variables are available to Next.js.

**Option 1: Use root `.env` file (Recommended)**
- Create or update `.env.local` or `.env` in the project root with the same variables
- Next.js will automatically load these

**Option 2: Copy backend/.env to root**
```bash
cp src/backend/.env .env.local
```

### Backend Environment Variables

The backend `.env` file has been created at `src/backend/.env` with your credentials. These variables are:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
JWT_SECRET="your-jwt-secret-key"

GCLOUD_PROJECT=your-gcloud-project-id
GCLOUD_BUCKET=your-gcloud-bucket-name
GCLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GCLOUD_PRIVATE_KEY="your-gcloud-private-key"

NODE_ENV=development
```

**Note:** The backend config module (`src/backend/config/index.js`) reads from `process.env`, which Next.js populates from root `.env` files. The `src/backend/.env` file serves as documentation/reference for backend-specific variables.

### Configuration Access

Import and use the config in your backend code:

```javascript
import config from '@/backend/config'

// Access configuration
const mongoUri = config.mongodb.uri
const jwtSecret = config.jwt.secret
const gcloudProject = config.gcloud.project
```

### Database Connection

The database connection is managed through `src/lib/db.js` and uses the `MONGODB_URI` or `MONGO_URI` environment variable. The backend config supports both variable names for compatibility.

## Usage

Next.js API routes in `/app/api` should import and use controllers/services from this backend folder:

```javascript
// Example: src/app/api/catalogues/route.js
import { catalogueController } from '@/backend/controllers/catalogueController'

export async function GET(req) {
  return catalogueController.getAll(req)
}

export async function POST(req) {
  return catalogueController.create(req)
}
```

This structure allows for:
- Separation of concerns
- Reusable business logic
- Easier testing
- Better code organization

