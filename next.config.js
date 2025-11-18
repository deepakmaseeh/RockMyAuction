/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
   serverExternalPackages: ['@google/generative-ai'],
  images: {
     domains: [
       's3.amazonaws.com', 
       'my-s3-bucket-auctiondata.s3.ap-south-1.amazonaws.com',
       'storage.googleapis.com' // Google Cloud Storage domain
     ],
    remotePatterns: [
      { protocol:'https', hostname:'**.amazonaws.com', pathname:'/**' },
      { protocol:'https', hostname:'storage.googleapis.com', pathname:'/**' } // GCS pattern
    ]
  },
}
module.exports = nextConfig
