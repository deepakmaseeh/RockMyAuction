# Catalog & Lot Management Microservice

This folder contains a standalone Express/MongoDB backend that powers the Wavebid-style catalog tooling we built in the Next.js admin UI.  
Keep it in this repository while developing, then lift it into your primary backend when you are ready to integrate.

## Features

- CRUD for auctions/catalogs (`/api/catalog/auctions`)
- Lot management with rich metadata (`/api/catalog/auctions/:id/lots`, `/api/catalog/lots/:lotId`)
- Bulk actions (publish, approval workflow, feature, delete, update fields)
- Drag-and-drop sequencing support (`/api/catalog/lots/reorder`)
- CSV import dry-run + commit pipeline
- CSV export endpoint (lots + media URLs)
- Event logging scaffold for audit trails

## Quick Start

```bash
cd catalog-backend
cp .env.example .env         # update Mongo connection + secrets
npm install
npm run dev
```

The service listens on `http://localhost:5050` by default.  
All routes are namespaced beneath `/api/catalog` to avoid conflicts with existing APIs.

## Folder Layout

```
catalog-backend/
  ├─ src/
  │  ├─ config/db.js          # MongoDB connection helper
  │  ├─ server.js             # Express bootstrap
  │  ├─ middleware/           # async + error handlers
  │  ├─ models/               # Auction, Lot, EventLog schemas
  │  ├─ controllers/          # REST controllers
  │  ├─ routes/               # Express routers
  │  └─ utils/csv.js          # import/export helpers
  └─ package.json
```

Port this code into your main backend when you are ready.  
If you already have shared models/helpers, swap the imports accordingly.

