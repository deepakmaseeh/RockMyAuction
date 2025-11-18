// Google Cloud Storage presigned URL endpoint
// This is an alternative endpoint for generating presigned URLs
import { NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

let storage = null
let bucket = null

try {
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
    // Handle private key - it may be provided with or without newline escapes
    let privateKey = requiredEnvVars.GCLOUD_PRIVATE_KEY
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
  }
} catch (error) {
  console.error('❌ Failed to initialize Google Cloud Storage:', error)
}

export async function POST(request) {
  if (!storage || !bucket) {
    return NextResponse.json({ 
      error: 'Google Cloud Storage not configured' 
    }, { status: 500 })
  }

  try {
    const { fileName, fileType } = await request.json()
    const key = `uploads/${Date.now()}-${fileName}`

    const file = bucket.file(key)
    
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 60 * 1000, // 60 seconds
      contentType: fileType,
    })

    const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${key}`

    return NextResponse.json({ uploadUrl: url, publicUrl })
  } catch (error) {
    console.error('❌ Google Cloud Storage presign error:', error)
    return NextResponse.json({ 
      error: `Failed to generate presigned URL: ${error.message}` 
    }, { status: 500 })
  }
}
