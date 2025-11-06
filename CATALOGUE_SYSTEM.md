# Catalogue & Lot Management System

## 🎉 System Overview

A complete catalogue and lot management system has been created for your auction platform. The system includes:

- **Catalogue Management** - Create, edit, delete, and view auction catalogues
- **Lot Management** - Add, edit, delete lots within catalogues
- **Static Demo Login** - No backend authentication required for testing

## 📁 File Structure

### Models
- `src/lib/models/Catalogue.js` - Catalogue database model
- `src/lib/models/Lot.js` - Lot database model

### API Routes
- `src/app/api/catalogues/route.js` - GET all catalogues, POST create catalogue
- `src/app/api/catalogues/[id]/route.js` - GET/PUT/DELETE single catalogue
- `src/app/api/lots/route.js` - GET all lots, POST create lot
- `src/app/api/lots/[id]/route.js` - GET/PUT/DELETE single lot

### UI Components
- `src/components/catalog/CatalogueBuilder.js` - Catalogue form component
- `src/components/catalog/LotBuilder.js` - Lot form component

### Pages
- `src/app/catalogues/page.js` - List all catalogues
- `src/app/catalogues/new/page.js` - Create new catalogue
- `src/app/catalogues/[id]/page.js` - View catalogue details with lots
- `src/app/catalogues/[id]/edit/page.js` - Edit catalogue
- `src/app/catalogues/[id]/lots/new/page.js` - Create new lot
- `src/app/catalogues/[id]/lots/[lotId]/edit/page.js` - Edit lot
- `src/app/catalogues/login/page.js` - Static demo login page

### Utilities
- `src/lib/defaultUser.js` - Default user management utilities

## 🚀 Quick Start

### 1. Access the Catalogue System

Simply navigate to: **`/catalogues`**

The system will automatically:
- Create a demo user if you're not logged in
- Log you in automatically
- Show the catalogue list page

### 2. Create Your First Catalogue

1. Click **"+ New Catalogue"** button
2. Fill in the form:
   - Title (required)
   - Description
   - Cover Image URL (optional)
   - Auction Date (required)
   - Location
   - Status (Draft/Published/Archived)
3. Click **"Create Catalogue"**

### 3. Add Lots to a Catalogue

1. Open a catalogue by clicking **"View"**
2. Click **"+ Add Lot"** button
3. Fill in the lot details:
   - Lot Number (required)
   - Title (required)
   - Description
   - Images (URLs)
   - Category
   - Condition
   - Pricing (Estimated Value, Starting Price, Reserve Price)
   - Dimensions & Weight
   - Provenance
   - Tags & Notes
4. Click **"Create Lot"**

## 📋 Features

### Catalogue Features
- ✅ Create, edit, delete catalogues
- ✅ Filter by status (Draft/Published/Archived)
- ✅ View catalogue details with all lots
- ✅ Automatic metadata calculation (total lots, estimated value)
- ✅ Cover image support

### Lot Features
- ✅ Create, edit, delete lots
- ✅ Multiple images per lot
- ✅ Comprehensive lot details (dimensions, weight, provenance)
- ✅ Category and condition management
- ✅ Pricing fields (estimated value, starting price, reserve price)
- ✅ Tags and notes
- ✅ Status management (Draft/Ready/Sold/Unsold)

### Demo Features
- ✅ Static login (no backend required)
- ✅ Auto-login on catalogue pages
- ✅ Default user creation
- ✅ Persistent demo user in localStorage

## 🔗 Navigation Routes

- `/catalogues` - Main catalogue list
- `/catalogues/new` - Create new catalogue
- `/catalogues/[id]` - View catalogue details
- `/catalogues/[id]/edit` - Edit catalogue
- `/catalogues/[id]/lots/new` - Add lot to catalogue
- `/catalogues/[id]/lots/[lotId]/edit` - Edit lot
- `/catalogues/login` - Static demo login (optional)

## 🎨 UI/UX

- Dark theme matching your existing design
- Orange/red gradient accents
- Responsive design (mobile-friendly)
- Smooth transitions and hover effects
- Status badges with color coding
- Image previews
- Form validation

## 💾 Data Model

### Catalogue Schema
```javascript
{
  title: String (required)
  description: String
  coverImage: String (URL)
  auctionDate: Date (required)
  location: String
  status: "draft" | "published" | "archived"
  createdBy: ObjectId (optional for demo)
  lots: [ObjectId] (references to Lot documents)
  metadata: {
    totalLots: Number
    estimatedValue: Number
  }
}
```

### Lot Schema
```javascript
{
  lotNumber: String (required)
  title: String (required)
  description: String
  images: [String] (URLs)
  category: String
  condition: "excellent" | "very-good" | "good" | "fair" | "poor"
  estimatedValue: Number
  startingPrice: Number
  reservePrice: Number
  provenance: String
  dimensions: {
    height: Number
    width: Number
    depth: Number
    unit: "cm" | "inches"
  }
  weight: {
    value: Number
    unit: "kg" | "grams" | "lbs" | "oz"
  }
  catalogue: ObjectId (required)
  status: "draft" | "ready" | "sold" | "unsold"
  createdBy: ObjectId (optional for demo)
  metadata: {
    notes: String
    tags: [String]
  }
}
```

## 🔧 Technical Details

### Default User System
- Creates a demo user automatically on first visit
- Stores user ID in localStorage
- Works without backend authentication
- User ID format: `default-user-[timestamp]`

### API Endpoints

**Catalogues:**
- `GET /api/catalogues` - List all catalogues (supports ?status= and ?createdBy= filters)
- `POST /api/catalogues` - Create new catalogue
- `GET /api/catalogues/[id]` - Get single catalogue
- `PUT /api/catalogues/[id]` - Update catalogue
- `DELETE /api/catalogues/[id]` - Delete catalogue (also deletes all lots)

**Lots:**
- `GET /api/lots` - List all lots (supports ?catalogue= and ?status= filters)
- `POST /api/lots` - Create new lot
- `GET /api/lots/[id]` - Get single lot
- `PUT /api/lots/[id]` - Update lot
- `DELETE /api/lots/[id]` - Delete lot

## ✨ Next Steps

1. **Test the UI**: Navigate to `/catalogues` and start creating catalogues
2. **Add Real Authentication**: Replace default user system with your actual auth when ready
3. **Customize**: Modify forms, fields, or styling as needed
4. **Integrate**: Connect with your auction system when ready

## 🐛 Troubleshooting

If you encounter issues:
1. Check browser console for errors
2. Verify MongoDB connection is working
3. Ensure localStorage is enabled in browser
4. Check that all API routes are accessible

## 📝 Notes

- The system uses MongoDB with Mongoose
- All timestamps are automatically managed
- Catalogue metadata (total lots, estimated value) updates automatically
- Images are stored as URLs (you can integrate with S3 later)
- The demo user system is temporary for testing purposes

---

**Ready to use!** 🎊 Navigate to `/catalogues` to start managing your auction catalogues and lots.





