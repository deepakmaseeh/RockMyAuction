/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
   experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  },
  images: {
     domains: ['s3.amazonaws.com', 'my-s3-bucket-auctiondata.s3.ap-south-1.amazonaws.com'],
    remotePatterns: [{ protocol:'https', hostname:'**.amazonaws.com', pathname:'/**' }]
  },
}
module.exports = nextConfig
