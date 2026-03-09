import { Heading, Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { TilbakeTilForside } from '@/app/components/tilbake-til-forside';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import DemoPanel from '@/components/demo-panel';
import { kanStartePeriode } from '../lib/api/inngang-kan-starte-periode';
import { RegistreringSjekkWrapper } from './components/RegistreringSjekkWrapper';

export default async function ForsidePage() {
    const modiaContext = await hentModiaContext();
    const kanStartePeriodePromise = kanStartePeriode(modiaContext.fnr);

    return (
        <div className={'flex flex-col max-w-3xl'}>
            <TilbakeTilForside sidenavn='Arbeidssøkerregistrering' />
            <Heading level='1' size='large' className='mb-8 text-left'>
                Arbeidssøkerregistrering
            </Heading>
            <Suspense fallback={<Loader />}>
                <RegistreringSjekkWrapper initialKanRegistreresPromise={kanStartePeriodePromise} />
            </Suspense>
            <DemoPanel />
        </div>
    );
}
