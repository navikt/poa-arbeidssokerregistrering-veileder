/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined
}

module.exports = nextConfig
