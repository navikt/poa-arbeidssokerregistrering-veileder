/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const decoratorUrlDev = 'https://internarbeidsflatedecorator-q1.intern.dev.nav.no';
const decoratorUrlProd = 'https://internarbeidsflatedecorator.intern.nav.no';
const nextConfig = {
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
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
            {
                source: '/veilarbperson/api/:path*',
                destination: '/api/veilarbperson/:path*',
            },
            {
                source: '/veilarbveileder/api/:path*',
                destination: '/api/veilarbveileder/:path*',
            },
            {
                source: '/obo-unleash/:path*',
                destination: '/api/obo-unleash/:path*',
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
            {
                source: '/veilarbportefoljeflatefs/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'arbeidssokerregistrering-for-veileder.intern.dev.nav.no',
                    },
                ],
                destination: 'https://veilarbportefoljeflate.intern.dev.nav.no/:path*',
                permanent: true,
            },
            {
                source: '/veilarbportefoljeflatefs/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'arbeidssokerregistrering-for-veileder.intern.nav.no',
                    },
                ],
                destination: 'https://veilarbportefoljeflate.intern.nav.no/:path*',
                permanent: true,
            },
        ];
    },
    reactStrictMode: true,
    output: 'standalone',
    assetPrefix: isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
};

module.exports = nextConfig;
