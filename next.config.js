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
  output: 'standalone',
}

module.exports = nextConfig