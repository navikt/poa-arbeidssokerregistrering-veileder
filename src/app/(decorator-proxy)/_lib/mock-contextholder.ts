import { type NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/mocks/modiacontextholder.json';

/**
 * Mock-handler for modiacontextholder.
 * Returnerer realistiske svar slik at internflate-dekoratøren fungerer lokalt.
 */
function lagMockContextHolder() {
    return async (request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) => {
        const { slug } = await params;
        const path = slug.join('/');

        if (request.method === 'GET') {
            if (path === 'context/v2/aktivbruker') {
                return NextResponse.json({ aktivBruker: mockData.aktivBruker });
            }
            if (path === 'context/v2/aktivenhet') {
                return NextResponse.json({ aktivEnhet: mockData.aktivEnhet });
            }
            if (path === 'decorator') {
                return NextResponse.json(mockData.veileder);
            }
            if (path.startsWith('context/enhet/')) {
                const enhetId = slug[slug.length - 1];
                const enhet = mockData.veileder.enheter.find((e) => e.enhetId === enhetId);
                if (enhet) {
                    return NextResponse.json(enhet);
                }
                return NextResponse.json({ message: 'Enhet ikke funnet' }, { status: 404 });
            }
            return NextResponse.json({ aktivEnhet: mockData.aktivEnhet, aktivBruker: mockData.aktivBruker });
        }

        if (request.method === 'POST') {
            return NextResponse.json({}, { status: 200 });
        }

        if (request.method === 'DELETE') {
            return NextResponse.json({}, { status: 200 });
        }

        return NextResponse.json({}, { status: 200 });
    };
}

export { lagMockContextHolder };
