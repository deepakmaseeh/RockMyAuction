# AWS S3 to Google Cloud Storage Migration Guide

This document outlines the changes made to migrate from AWS S3 to Google Cloud Storage.

## Changes Made

### 1. Package Dependencies
- **Removed**: `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
- **Added**: `@google-cloud/storage`

### 2. Environment Variables

**Old AWS Variables (Removed):**
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
```

**New Google Cloud Variables (Required):**
```env
GCLOUD_PROJECT=gemini-auction-ai
GCLOUD_BUCKET=auction-bucket-gemini-auction-ai
GCLOUD_CLIENT_EMAIL=my-service-account@gemini-auction-ai.iam.gserviceaccount.com
GCLOUD_PRIVATE_KEY="87bd3aaf3b660856ddc7e931801e14e5938e2f5a"
```

### 3. Files Modified

#### API Routes
- `src/app/api/s3-upload/route.js` - Now uses Google Cloud Storage SDK
- `src/app/api/s3-presign/route.js` - Now uses Google Cloud Storage SDK

#### Components
- `src/components/S3DirectUploadForm.js` - Updated to use GCS presigned URLs (component renamed to `GCSDirectUploadForm` internally)
- `src/components/AddNewAuctionForm.js` - Updated references from S3 to Google Cloud Storage

#### Configuration
- `src/backend/config/index.js` - Removed AWS configuration, kept only GCS
- `src/app/api/analyze-image/route.js` - Updated error messages to reference GCS

### 4. API Endpoints

The endpoint URLs remain the same for backward compatibility:
- `/api/s3-upload` - Now generates Google Cloud Storage presigned URLs
- `/api/s3-presign` - Alternative GCS presign endpoint

**Note**: Despite the endpoint names containing "s3", they now use Google Cloud Storage.

### 5. File URLs

**Old S3 URL Format:**
```
https://bucket-name.s3.region.amazonaws.com/path/to/file.jpg
```

**New Google Cloud Storage URL Format:**
```
https://storage.googleapis.com/bucket-name/path/to/file.jpg
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @google-cloud/storage
npm uninstall @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Set Environment Variables

Add the following to your `.env.local` or backend server environment:

```env
PORT=5000
MONGO_URI=mongodb+srv://adityasingh62004_db_user:S0D11Aty9atXi6Ov@cluster0.dgcod7i.mongodb.net/
JWT_SECRET="h7p9Jk2Lm8Qv4Wx6Zt1Yc3Bn5R"
GCLOUD_PROJECT=gemini-auction-ai
GCLOUD_BUCKET=auction-bucket-gemini-auction-ai
GCLOUD_CLIENT_EMAIL=my-service-account@gemini-auction-ai.iam.gserviceaccount.com
GCLOUD_PRIVATE_KEY="87bd3aaf3b660856ddc7e931801e14e5938e2f5a"
NODE_ENV=development
```

### 3. Google Cloud Storage Setup

1. **Create a Storage Bucket** (if not already created):
   ```bash
   gsutil mb -p gemini-auction-ai gs://auction-bucket-gemini-auction-ai
   ```

2. **Set Bucket Permissions** (for public read access to uploaded files):
   ```bash
   gsutil iam ch allUsers:objectViewer gs://auction-bucket-gemini-auction-ai
   ```

3. **Configure CORS** (for direct browser uploads):
   Create a `cors.json` file:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   
   Then apply it:
   ```bash
   gsutil cors set cors.json gs://auction-bucket-gemini-auction-ai
   ```

4. **Service Account Setup**:
   - Create a service account in Google Cloud Console
   - Grant it "Storage Admin" or "Storage Object Admin" role
   - Download the JSON key file
   - Use the `client_email` and `private_key` from the JSON file in your environment variables

### 4. Private Key Format

**Important**: The `GCLOUD_PRIVATE_KEY` should include the full private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers. If stored in environment variables, ensure newlines are preserved or use `\n` escape sequences.

Example:
```env
GCLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## Testing

1. **Test File Upload**:
   - Navigate to `/demo/s3-upload` (if available)
   - Upload a test image
   - Verify it appears in your Google Cloud Storage bucket

2. **Test Presigned URLs**:
   ```bash
   curl -X POST http://localhost:3000/api/s3-upload \
     -H "Content-Type: application/json" \
     -d '{"fileName": "test.jpg", "fileType": "image/jpeg"}'
   ```

3. **Verify File Access**:
   - Check that uploaded files are accessible via the returned URLs
   - Ensure public read permissions are correctly set

## Troubleshooting

### Error: "Google Cloud Storage not initialized"
- Check that all `GCLOUD_*` environment variables are set
- Verify the private key format (should include newlines)
- Ensure the service account has proper permissions

### Error: "Failed to generate upload URL"
- Verify the bucket name is correct
- Check that the service account has "Storage Object Admin" permissions
- Ensure the project ID matches your Google Cloud project

### Files not publicly accessible
- Run the bucket permission command above
- Check bucket IAM policies in Google Cloud Console
- Verify CORS configuration if uploading from browser

## Backward Compatibility

- API endpoint URLs remain unchanged (`/api/s3-upload`, `/api/s3-presign`)
- Response format remains the same
- Frontend code continues to work without changes (except for updated error messages)

## Next Steps

1. Update any hardcoded S3 URLs in your database to Google Cloud Storage URLs
2. Consider renaming the API endpoints in a future version (e.g., `/api/gcs-upload`)
3. Update documentation and user-facing messages to reference Google Cloud Storage

