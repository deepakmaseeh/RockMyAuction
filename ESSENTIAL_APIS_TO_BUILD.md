# Essential APIs to Build - Simplified List

## 🎯 Answer: You Need to Build **25 Essential APIs** (reduced from 60+)

---

## ✅ PHASE 1: MUST BUILD FIRST (12 APIs)

These are **critical** - frontend won't work without them:

### Authentication (3 APIs)
1. `POST /api/auth/register` - User registration
2. `POST /api/auth/login` - User login  
3. `GET /api/auth/profile` - Get current user
4. `PUT /api/auth/profile` - Update profile

**Note**: #3 and #4 are same route, different methods = **1 file, 2 handlers**

### Auctions (5 APIs)
5. `GET /api/auctions` - List all auctions (supports `?active=true`, `?category=`, `?status=`, etc.)
6. `GET /api/auctions/:id` - Get single auction
7. `POST /api/auctions` - Create auction
8. `PUT /api/auctions/:id` - Update auction
9. `DELETE /api/auctions/:id` - Delete auction

### Bidding (2 APIs)
10. `POST /api/bids` - Place a bid
11. `GET /api/bids/:auctionId` - Get bids for auction

### File Upload (1 API)
12. `POST /api/gcs-upload` - Get Google Cloud Storage presigned upload URL

**Note**: This endpoint uses Google Cloud Storage (not AWS S3). The endpoint name can be `/api/gcs-upload` or `/api/s3-upload` (for backward compatibility).

### Image Analysis (1 API)
13. `POST /api/analyze-image` - Analyze uploaded image (supports form fill mode)

---

## 🚀 PHASE 2: USER FEATURES (8 APIs)

### Users (3 APIs)
14. `GET /api/users` - Get users (supports `?id=userId` for single user)
15. `PUT /api/users/:userId` - Update user (supports `{ action: 'block' }` or `{ action: 'deactivate' }`)
16. `DELETE /api/users/:userId` - Delete user

### Wishlist (3 APIs)
17. `GET /api/wishlist` - Get wishlist (supports `?check=auctionId` to check if exists)
18. `POST /api/wishlist` - Add to wishlist
19. `DELETE /api/wishlist/:auctionId` - Remove from wishlist

### Wallet (4 APIs)
20. `GET /api/wallet` - Get wallet balance
21. `GET /api/wallet/transactions` - Get transactions
22. `POST /api/wallet/add` - Add money
23. `POST /api/wallet/withdraw` - Withdraw money
24. `GET /api/wallet/payment-methods` - Get payment methods

### User Data (2 APIs)
25. `GET /api/user/bids` - Get user's bids (`?userId=`)
26. `GET /api/seller/analytics` - Get seller analytics (`?userId=`)

---

## 📋 PHASE 3: CATALOG (8 APIs)

### Catalogues (4 APIs)
27. `GET /api/catalogues` - List catalogues
28. `GET /api/catalogues/:id` - Get single catalogue
29. `POST /api/catalogues` - Create catalogue
30. `PUT /api/catalogues/:id` - Update catalogue

### Lots (4 APIs)
31. `GET /api/lots` - List lots (supports `?catalogue=`, `?auction=`, etc.)
32. `GET /api/lots/:lotId` - Get single lot
33. `POST /api/lots` - Create lot
34. `PUT /api/lots/:lotId` - Update lot
35. `DELETE /api/lots/:lotId` - Delete lot

---

## 🔧 PHASE 4: ADMIN (5 APIs)

36. `GET /api/admin/auctions` - Admin view of auctions
37. `GET /api/admin/auctions/:id/lots` - Get lots for auction (admin)
38. `POST /api/admin/lots/bulk` - Bulk lot actions
39. `PUT /api/admin/lots/reorder` - Reorder lots

---

## 🎨 PHASE 5: ADVANCED (5 APIs)

40. `POST /api/ai/generate` - AI content generation (supports `type: 'lotDraft'`)
41. `POST /api/search` - Search functionality
42. `POST /api/chat` - Chatbot
43. `POST /api/support` - Support ticket

---

## 📊 Summary

| Phase | APIs | Can Skip? |
|-------|------|-----------|
| **Phase 1** | **12 APIs** | ❌ **NO** - Frontend won't work |
| **Phase 2** | **8 APIs** | ⚠️ **Maybe** - Basic features need these |
| **Phase 3** | **8 APIs** | ⚠️ **Maybe** - If not using catalog feature |
| **Phase 4** | **5 APIs** | ✅ **YES** - Admin can wait |
| **Phase 5** | **5 APIs** | ✅ **YES** - Nice to have |

---

## 🎯 Minimum to Get Started: **12 APIs**

Build these first:
1. ✅ POST `/api/auth/register`
2. ✅ POST `/api/auth/login`
3. ✅ GET `/api/auth/profile`
4. ✅ PUT `/api/auth/profile`
5. ✅ GET `/api/auctions`
6. ✅ GET `/api/auctions/:id`
7. ✅ POST `/api/auctions`
8. ✅ POST `/api/bids`
9. ✅ GET `/api/bids/:auctionId`
10. ✅ POST `/api/gcs-upload` (or `/api/s3-upload` for backward compatibility)
11. ✅ POST `/api/analyze-image`
12. ✅ PUT `/api/auctions/:id` (for updates)

---

## 💡 Key Merging Decisions

Instead of building separate endpoints, use:

- **Query parameters** for filtering:
  - `GET /api/auctions?active=true` (instead of `/api/auctions/active`)
  - `GET /api/wishlist?check=auctionId` (instead of `/api/wishlist/check/:auctionId`)

- **Body parameters** for actions:
  - `PUT /api/users/:userId` with `{ action: 'block' }` (instead of `/api/users/:userId/block`)

- **Same routes** with role checks:
  - Admin can use `/api/auctions` with admin role check (instead of separate `/api/admin/auctions`)

This reduces **60+ endpoints to 25 essential APIs**!

