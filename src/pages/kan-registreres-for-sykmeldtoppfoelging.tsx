import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { withAuthenticatedPage } from '../auth/withAuthentication';

export default function KanRegistreresForSykmeldtoppfoelging() {
    const Router = useRouter();

    useEffect(() => {
        Router.push('/registrering-mer-sykmeldtoppfolging');
    }, []);
}

export const getServerSideProps = withAuthenticatedPage();
