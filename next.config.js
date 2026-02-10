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
}

module.exports = nextConfig