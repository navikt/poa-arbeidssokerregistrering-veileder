/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const decoraturUrl = process.env.DECORATOR_URL;
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/modiacontextholder/api/context/:path',
                destination: '/api/modiacontextholder/context/:path',
            },
            {
                source: '/modiacontextholder/api/:path',
                destination: '/api/modiacontextholder/:path',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/internarbeidsflatedecorator/:path*',
                destination: `${decoraturUrl}/internarbeidsflatedecorator/:path*`,
                permanent: true,
            },
        ];
    },
    reactStrictMode: true,
    output: 'standalone',
    assetPrefix: isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
};

module.exports = nextConfig;
