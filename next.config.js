/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  assetPrefix: isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined
}

module.exports = nextConfig
