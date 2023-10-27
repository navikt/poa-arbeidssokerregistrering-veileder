export const formaterDato = (dato: Date | string): string =>
    new Date(dato).toLocaleDateString('no', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
