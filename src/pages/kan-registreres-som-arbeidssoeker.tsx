import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { withAuthenticatedPage } from '../auth/withAuthentication';

export default function KanRegistreresSomArbeidssoeker() {
    const Router = useRouter();

    useEffect(() => {
        Router.push('/registrering-arbeidssoker');
    }, []);
}

export const getServerSideProps = withAuthenticatedPage();
