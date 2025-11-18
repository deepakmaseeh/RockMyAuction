# Consolidated API List - Essential Endpoints Only

## Summary
**Total Essential APIs: 25 endpoints** (reduced from 60+ by merging duplicates)

---

## 🎯 PHASE 1: Core APIs (Must Have - 12 endpoints)

These are the **minimum required** to get the frontend working.

### 1. Authentication (3 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| POST | `/api/auth/register` | User registration | - |
| POST | `/api/auth/login` | User login | - |
| GET | `/api/auth/profile` | Get current user profile | - |
| PUT | `/api/auth/profile` | Update user profile | - |

**Note**: GET and PUT on same endpoint `/api/auth/profile` = **1 route file, 2 methods**

---

### 2. Auctions (5 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/auctions` | Get all auctions (supports filters: `status`, `active`, `category`, `createdBy`, `page`, `limit`) | Merged: `/api/auctions/active` → use `?active=true` |
| GET | `/api/auctions/:id` | Get single auction | - |
| POST | `/api/auctions` | Create new auction | Merged: `/api/auctions/create` → removed (duplicate) |
| PUT | `/api/auctions/:id` | Update auction | - |
| DELETE | `/api/auctions/:id` | Delete auction | - |

**Merged**: `/api/auctions/active` → use GET `/api/auctions?active=true`  
**Merged**: `/api/auctions/create` → use POST `/api/auctions`

---

### 3. Bidding (2 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| POST | `/api/bids` | Place a bid (body: `{ auctionId, bidAmount }`) | - |
| GET | `/api/bids/:auctionId` | Get all bids for an auction | - |

---

### 4. File Upload (1 endpoint)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| POST | `/api/s3-upload` | Get Google Cloud Storage presigned URL (body: `{ fileName, fileType }`) | Merged: `/api/s3-presign` → removed (duplicate) |

**Important**: Despite the endpoint name containing "s3", this endpoint uses **Google Cloud Storage**, not AWS S3. The name is kept for backward compatibility with the frontend code.

**Merged**: `/api/s3-presign` → use POST `/api/s3-upload` (same functionality)

---

### 5. Image Analysis (1 endpoint)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| POST | `/api/analyze-image` | Analyze uploaded image (body: `{ imageKey, imageUrl, formFill? }`) | Merged: `/api/analyze-image-form` → use `formFill: true` param |

**Merged**: `/api/analyze-image-form` → use POST `/api/analyze-image` with `formFill: true` in body

---

## 🚀 PHASE 2: User Features (8 endpoints)

### 6. Users (3 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/users` | Get all users (admin) or single user (query: `?id=userId`) | Merged: `/api/users/:sellerId` → use `?id=userId` |
| PUT | `/api/users/:userId` | Update user (supports: block, deactivate, or general update via body.action) | Merged: `/api/users/:userId/block`, `/api/users/:userId/deactivate` |
| DELETE | `/api/users/:userId` | Delete user | - |

**Merged**: 
- `/api/users/:sellerId` → use GET `/api/users?id=userId`
- `/api/users/:userId/block` → use PUT `/api/users/:userId` with `{ action: 'block' }`
- `/api/users/:userId/deactivate` → use PUT `/api/users/:userId` with `{ action: 'deactivate' }`

---

### 7. Wishlist (3 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/wishlist` | Get user's wishlist (query: `?check=auctionId` to check if in wishlist) | Merged: `/api/wishlist/check/:auctionId` → use `?check=auctionId` |
| POST | `/api/wishlist` | Add auction to wishlist (body: `{ auctionId }`) | - |
| DELETE | `/api/wishlist/:auctionId` | Remove auction from wishlist | - |

**Merged**: `/api/wishlist/check/:auctionId` → use GET `/api/wishlist?check=auctionId`  
**Merged**: `/api/user/watchlist` → use GET `/api/wishlist` (same thing)

---

### 8. Wallet (4 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/wallet` | Get user's wallet | - |
| GET | `/api/wallet/transactions` | Get wallet transactions (filters: `page`, `limit`, `type`, `dateFrom`, `dateTo`) | - |
| POST | `/api/wallet/add` | Add money to wallet (body: `{ amount, paymentMethod }`) | - |
| POST | `/api/wallet/withdraw` | Withdraw money (body: `{ amount, withdrawalMethod }`) | - |
| GET | `/api/wallet/payment-methods` | Get available payment methods | - |

---

### 9. User Data (2 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/user/bids` | Get user's bids (query: `userId`) | - |
| GET | `/api/seller/analytics` | Get seller analytics (query: `userId`) | - |

---

## 📋 PHASE 3: Catalog Management (8 endpoints)

### 10. Catalogues (4 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/catalogues` | Get all catalogues (filters: `status`, `createdBy`, `page`, `limit`) | - |
| GET | `/api/catalogues/:id` | Get single catalogue | - |
| POST | `/api/catalogues` | Create new catalogue | - |
| PUT | `/api/catalogues/:id` | Update catalogue | - |

**Skipped**: `/api/catalogues/demo` (optional, can add later)

---

### 11. Lots (5 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/lots` | Get all lots (filters: `catalogue`, `auction`, `status`, `category`, `page`, `limit`) | - |
| GET | `/api/lots/:lotId` | Get single lot | Merged: `/api/admin/lots/:lotId` → same endpoint, check role |
| POST | `/api/lots` | Create new lot | Merged: `/api/admin/auctions/:id/lots` → use POST `/api/lots` with `auctionId` in body |
| PUT | `/api/lots/:lotId` | Update lot | Merged: `/api/admin/lots/:lotId` (PATCH) → use PUT |
| DELETE | `/api/lots/:lotId` | Delete lot | - |

**Merged**: 
- `/api/admin/lots/:lotId` → use `/api/lots/:lotId` (check admin role)
- `/api/admin/auctions/:id/lots` (POST) → use POST `/api/lots` with `auctionId` in body

---

## 🔧 PHASE 4: Admin Features (5 endpoints)

### 12. Admin Auctions (2 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/admin/auctions` | Get all auctions (admin view with filters) | Merged: Can use GET `/api/auctions` with admin auth |
| GET | `/api/admin/auctions/:id` | Get single auction (admin view) | Merged: Use GET `/api/auctions/:id` with admin auth |

**Merged**: Admin auction endpoints → use regular `/api/auctions` endpoints with admin role check

---

### 13. Admin Lots (3 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| GET | `/api/admin/auctions/:id/lots` | Get lots for auction (admin view with filters) | - |
| POST | `/api/admin/lots/bulk` | Bulk lot actions (body: `{ action, lotIds, field?, value? }`) | - |
| PUT | `/api/admin/lots/reorder` | Reorder lots (body: `{ auctionId, order: [lotIds] }`) | - |

**Skipped for now** (can add later):
- `/api/admin/lots/renumber` 
- `/api/admin/lots/import`
- `/api/admin/lots/export`

---

## 🎨 PHASE 5: Advanced Features (5 endpoints)

### 14. AI/ML (2 endpoints)
| Method | Endpoint | Description | Merged From |
|--------|----------|-------------|-------------|
| POST | `/api/ai/generate` | Generate AI content (body: `{ prompt, type? }`) | Merged: `/api/ai/generateLotDraft` → use `type: 'lotDraft'` |
| POST | `/api/analyze-image` | Already in Phase 1 | - |

**Merged**: `/api/ai/generateLotDraft` → use POST `/api/ai/generate` with `{ prompt, type: 'lotDraft' }`

---

### 15. Search & Chat (2 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search` | Search functionality |
| POST | `/api/chat` | Chatbot endpoint (body: `{ message, image?, mode, history }`) |

---

### 16. Support (1 endpoint)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/support` | Submit support request (body: `{ category, email, subject, message }`) |

---

## 📊 Final Count by Phase

| Phase | Endpoints | Priority |
|-------|-----------|----------|
| **Phase 1: Core** | **12 endpoints** | 🔴 **CRITICAL** - Must implement first |
| **Phase 2: User Features** | **8 endpoints** | 🟡 **HIGH** - Needed for user experience |
| **Phase 3: Catalog** | **8 endpoints** | 🟡 **HIGH** - For catalog management |
| **Phase 4: Admin** | **5 endpoints** | 🟢 **MEDIUM** - Admin functionality |
| **Phase 5: Advanced** | **5 endpoints** | 🟢 **LOW** - Nice to have |

**Total: 38 endpoints** (reduced from 60+)

---

## 🎯 Quick Start: Minimum Viable APIs

To get the frontend **basically working**, implement these **12 endpoints**:

1. ✅ POST `/api/auth/register`
2. ✅ POST `/api/auth/login`
3. ✅ GET `/api/auth/profile`
4. ✅ PUT `/api/auth/profile`
5. ✅ GET `/api/auctions` (with filters)
6. ✅ GET `/api/auctions/:id`
7. ✅ POST `/api/auctions`
8. ✅ POST `/api/bids`
9. ✅ GET `/api/bids/:auctionId`
10. ✅ POST `/api/s3-upload` (uses Google Cloud Storage, not AWS S3)
11. ✅ POST `/api/analyze-image`
12. ✅ PUT `/api/auctions/:id` (optional, for updates)

---

## 🔄 Merging Strategy Summary

### Merged Endpoints:
1. ✅ `/api/auctions/create` → Use POST `/api/auctions`
2. ✅ `/api/auctions/active` → Use GET `/api/auctions?active=true`
3. ✅ `/api/s3-presign` → Use POST `/api/s3-upload` (both use Google Cloud Storage)
4. ✅ `/api/analyze-image-form` → Use POST `/api/analyze-image` with `formFill: true`
5. ✅ `/api/users/:sellerId` → Use GET `/api/users?id=userId`
6. ✅ `/api/users/:userId/block` → Use PUT `/api/users/:userId` with `{ action: 'block' }`
7. ✅ `/api/users/:userId/deactivate` → Use PUT `/api/users/:userId` with `{ action: 'deactivate' }`
8. ✅ `/api/wishlist/check/:auctionId` → Use GET `/api/wishlist?check=auctionId`
9. ✅ `/api/user/watchlist` → Use GET `/api/wishlist`
10. ✅ `/api/admin/auctions` → Use GET `/api/auctions` with admin role
11. ✅ `/api/admin/auctions/:id` → Use GET `/api/auctions/:id` with admin role
12. ✅ `/api/admin/lots/:lotId` → Use `/api/lots/:lotId` with admin role
13. ✅ `/api/admin/auctions/:id/lots` (POST) → Use POST `/api/lots` with `auctionId` in body
14. ✅ `/api/ai/generateLotDraft` → Use POST `/api/ai/generate` with `type: 'lotDraft'`

---

## 📝 Implementation Notes

1. **Role-Based Access**: Many admin endpoints can use the same routes as regular endpoints, just check user role in middleware
2. **Query Parameters**: Use query params for filtering instead of separate endpoints
3. **Action Parameters**: Use body parameters like `{ action: 'block' }` instead of separate endpoints
4. **Response Format**: All endpoints should return:
   ```json
   {
     "success": true,
     "data": {...},
     "message": "..."
   }
   ```
5. **Error Format**: All errors should return:
   ```json
   {
     "success": false,
     "error": "Error message",
     "message": "Error message"
   }
   ```

---

## 🚀 Recommended Implementation Order

1. **Week 1**: Phase 1 (12 endpoints) - Core functionality
2. **Week 2**: Phase 2 (8 endpoints) - User features
3. **Week 3**: Phase 3 (8 endpoints) - Catalog management
4. **Week 4**: Phase 4 & 5 (10 endpoints) - Admin & Advanced

This gives you a working frontend in Week 1, then progressively adds features!

