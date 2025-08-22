// import { NextResponse } from 'next/server'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
// import { v4 as uuidv4 } from 'uuid'

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || 'us-east-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// })

// export async function POST(request) {
//   try {
//     const { fileName, fileType } = await request.json()
    
//     const fileExtension = fileName.split('.').pop()
//     const key = `auctions/${uuidv4()}.${fileExtension}`
    
//     const command = new PutObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: key,
//       ContentType: fileType,
//     })
    
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }) // 5 minutes
    
//     const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
    
//     return NextResponse.json({ url, key, fileUrl })
//   } catch (error) {
//     console.error('S3 upload error:', error)
//     return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

// Validate environment variables
const requiredEnvVars = {
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars)
}

const s3Client = missingVars.length === 0 ? new S3Client({
  region: requiredEnvVars.AWS_REGION,
  credentials: {
    accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY,
  },
}) : null

export async function POST(request) {
  try {
    if (!s3Client) {
      return NextResponse.json({ 
        error: `Server misconfigured. Missing env vars: ${missingVars.join(', ')}` 
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
    
    const command = new PutObjectCommand({
      Bucket: requiredEnvVars.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    })
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }) // 5 minutes
    
    const fileUrl = `https://${requiredEnvVars.AWS_S3_BUCKET_NAME}.s3.${requiredEnvVars.AWS_REGION}.amazonaws.com/${key}`
    
    console.log('✅ Generated URLs:', { key, fileUrl })
    
    return NextResponse.json({ url, key, fileUrl })
  } catch (error) {
    console.error('❌ S3 upload error:', error)
    return NextResponse.json({ 
      error: `Failed to generate upload URL: ${error.message}` 
    }, { status: 500 })
  }
}
 