/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
   experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  }
}

module.exports = nextConfig
