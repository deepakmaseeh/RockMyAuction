# API Endpoint Clarification - Google Cloud Storage

## Important Note About File Upload Endpoints

### Endpoint Name vs. Actual Service

The file upload endpoint is named `/api/s3-upload` for **backward compatibility** with the existing frontend code, but it actually uses **Google Cloud Storage**, not AWS S3.

### Current Implementation

- **Endpoint**: `POST /api/s3-upload`
- **Actual Service**: Google Cloud Storage
- **Why the name?**: Frontend code already calls `/api/s3-upload`, so we kept the name to avoid breaking changes

### What You Need to Build

When building the backend, implement:

```javascript
POST /api/s3-upload
```

But use **Google Cloud Storage SDK** (`@google-cloud/storage`), not AWS S3 SDK.

### Example Implementation

```javascript
// Backend route: POST /api/s3-upload
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY,
  },
});

const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

// Generate presigned URL for upload
const file = bucket.file(key);
const [url] = await file.getSignedUrl({
  version: 'v4',
  action: 'write',
  expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  contentType: fileType,
});
```

### Summary

✅ **Use**: Google Cloud Storage  
✅ **Endpoint Name**: `/api/s3-upload` (for compatibility)  
❌ **Don't Use**: AWS S3  

The frontend will continue to work because it calls `/api/s3-upload`, but your backend will use Google Cloud Storage to handle the uploads.

