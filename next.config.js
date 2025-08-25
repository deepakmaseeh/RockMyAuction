/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
   experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  },
  images: {
    domains: [
      // Whitelist your S3 bucket domain
      'my-s3-bucket-auctiondata.s3.ap-south-1.amazonaws.com',
    ],
  },
}

module.exports = nextConfig
