/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'recharts', 'framer-motion'],
  },
  // Vercel build optimization
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || 'development'
  },
  // iOS Safari compatibility headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          },
          {
            key: 'X-UA-Compatible',
            value: 'IE=edge'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig