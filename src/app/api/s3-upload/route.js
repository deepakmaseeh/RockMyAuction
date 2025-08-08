import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'File name and type are required' }, { status: 400 });
    }

    // Create a unique key for the file
    const key = `uploads/${Date.now()}-${fileName}`;
    
    // Create the command to put the object in S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Generate a pre-signed URL
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Return the URL and key to the client
    return NextResponse.json({ 
      success: true, 
      url, 
      key,
      // Include the full S3 URL for the file after upload
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });
  } catch (error) {
    console.error('Error creating pre-signed URL:', error);
    return NextResponse.json({ error: 'Failed to create pre-signed URL' }, { status: 500 });
  }
}