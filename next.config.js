/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const decoratorUrlDev = 'https://internarbeidsflatedecorator-q1.intern.dev.nav.no';
const decoratorUrlProd = 'https://internarbeidsflatedecorator.intern.nav.no';
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/modiacontextholder/api/:path*',
                destination: '/api/modiacontextholder/:path*',
            },
            {
                source: '/veilarboppfolging/api/:path*',
                destination: '/api/veilarboppfolging/:path*',
            },
            {
                source: '/veilarbdialog/api/:path*',
                destination: '/api/veilarbdialog/:path*',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/internarbeidsflatedecorator/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'arbeidssokerregistrering-for-veileder.intern.dev.nav.no',
                    },
                ],
                destination: `${decoratorUrlDev}/internarbeidsflatedecorator/:path*`,
                permanent: true,
            },
            {
                source: '/internarbeidsflatedecorator/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'arbeidssokerregistrering-for-veileder.intern.nav.no',
                    },
                ],
                destination: `${decoratorUrlProd}/internarbeidsflatedecorator/:path*`,
                permanent: true,
            },
        ];
    },
    reactStrictMode: true,
    output: 'standalone',
    assetPrefix: isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
};

module.exports = nextConfig;
