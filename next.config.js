/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const decoraturUrl = process.env.DECORATOR_URL;
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/internarbeidsflatedecorator/:path*',
    //             destination: `${decoraturUrl}/internarbeidsflatedecorator/:path*`,
    //         },
    //     ];
    // },
    reactStrictMode: true,
    output: 'standalone',
    assetPrefix: isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
};

module.exports = nextConfig;
