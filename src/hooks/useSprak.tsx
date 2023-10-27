import { useRouter } from 'next/router';
import { erStottetSprak, Sprak } from '../lib/lag-hent-tekst-for-sprak';

const useSprak = (): Sprak => {
    const { locale } = useRouter() || { locale: 'nb' };
    return erStottetSprak(locale) ? locale : 'nb';
};

export default useSprak;
