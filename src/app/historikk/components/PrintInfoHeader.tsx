import Image from 'next/image';
import { prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';

interface Props {
    fnr: string | null;
}

const PrintInfoHeader = (props: Props) => {
    return (
        <section className={'hidden print:block w-full mt-4 mb-8 text-center'}>
            <div className={'flex flex-col content-center justify-center flex-wrap'}>
                <Image src={'/nav-logo.svg'} alt={'Nav Logo'} width={100} height={50} />
            </div>
            <div className={'mt-8 mb-4'}>
                Utskriftsdato: {prettyPrintDatoOgKlokkeslett(new Date().toISOString(), 'nb', true)}
            </div>
            <div>Fødselsnummer: {props.fnr || '--'}</div>
        </section>
    );
};

export default PrintInfoHeader;
