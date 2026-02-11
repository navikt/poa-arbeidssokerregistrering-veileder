'use client';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Accordion, Table } from '@navikt/ds-react';
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion';
import { TableBody, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table';
import { use } from 'react';
import { HendelseVisning } from '@/app/tidslinjer/HendelseVisning';
import { formaterDato } from '@/lib/date-utils';

type TidslinjerProps = {
	perioderPromise: Promise<{
		perioder: Periode[] | null;
		error?: Error;
	}>;
};

const Tidslinjer: React.FC<TidslinjerProps> = (props) => {
	const { perioderPromise } = props;
	const { perioder, error } = use(perioderPromise);

	if (error) {
		return 'error...';
	}

	if (!perioder || perioder.length === 0) {
		return 'ingen perioder';
	}

	return (
		<Accordion>
			{perioder?.map((periode) => (
				<AccordionItem key={periode.periodeId}>
					<AccordionHeader>
						{formaterDato(periode.startet)} - {formaterDato(periode.avsluttet)}
					</AccordionHeader>
					<AccordionContent>
						<Table size='small' className='mb-4'>
							<TableHeader>
								<TableRow>
									<TableHeaderCell scope='col'>Tidspunkt</TableHeaderCell>
									<TableHeaderCell scope='col'>Hendelse</TableHeaderCell>
									<TableHeaderCell scope='col'>Kilde</TableHeaderCell>
									<TableHeaderCell scope='col'>Status</TableHeaderCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{periode.hendelser.toReversed().map((hendelse, i) => (
									<HendelseVisning key={`${periode.periodeId}_${i}`} hendelse={hendelse} />
								))}
							</TableBody>
						</Table>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export { Tidslinjer };
