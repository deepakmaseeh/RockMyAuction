import { NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'

// Initialize Google Cloud Storage client
let storage = null
let bucket = null

try {
  // Validate environment variables
  const requiredEnvVars = {
    GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
    GCLOUD_BUCKET: process.env.GCLOUD_BUCKET,
    GCLOUD_CLIENT_EMAIL: process.env.GCLOUD_CLIENT_EMAIL,
    GCLOUD_PRIVATE_KEY: process.env.GCLOUD_PRIVATE_KEY,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error('❌ Missing required Google Cloud environment variables:', missingVars)
  } else {
    // Initialize Storage client with service account credentials
    // Handle private key - it may be provided with or without newline escapes
    let privateKey = requiredEnvVars.GCLOUD_PRIVATE_KEY
    // If it doesn't start with BEGIN, it might be just the key without markers
    // Otherwise, replace escaped newlines
    if (privateKey.includes('BEGIN')) {
      privateKey = privateKey.replace(/\\n/g, '\n')
    }
    
    storage = new Storage({
      projectId: requiredEnvVars.GCLOUD_PROJECT,
      credentials: {
        client_email: requiredEnvVars.GCLOUD_CLIENT_EMAIL,
        private_key: privateKey,
      },
    })

    bucket = storage.bucket(requiredEnvVars.GCLOUD_BUCKET)
    console.log('✅ Google Cloud Storage initialized successfully')
  }
} catch (error) {
  console.error('❌ Failed to initialize Google Cloud Storage:', error)
}

export async function POST(request) {
  try {
    if (!storage || !bucket) {
      return NextResponse.json({ 
        error: 'Server misconfigured. Google Cloud Storage not initialized. Check GCLOUD_* environment variables.' 
      }, { status: 500 })
    }

    const { fileName, fileType } = await request.json()
    
    if (!fileName || !fileType) {
      return NextResponse.json({ 
        error: 'fileName and fileType are required' 
      }, { status: 400 })
    }

    console.log('📤 Generating presigned URL for:', { fileName, fileType })
    
    const fileExtension = fileName.split('.').pop() || 'jpg'
    const key = `auctions/${uuidv4()}.${fileExtension}`
    
    // Get a reference to the file
    const file = bucket.file(key)
    
    // Generate a signed URL for uploading
    // Options: expires in 5 minutes, allows PUT method
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      contentType: fileType,
    })
    
    // Generate the public URL (assuming bucket is configured for public access)
    const fileUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${key}`
    
    console.log('✅ Generated URLs:', { key, fileUrl })
    
    return NextResponse.json({ url, key, fileUrl })
  } catch (error) {
    console.error('❌ Google Cloud Storage upload error:', error)
    return NextResponse.json({ 
      error: `Failed to generate upload URL: ${error.message}` 
    }, { status: 500 })
  }
}
