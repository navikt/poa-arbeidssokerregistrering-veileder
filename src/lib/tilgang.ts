/** For lese-operasjoner — returnerer { [dataField]: null, manglerTilgang: true } */
/** Eks: for perioder vil den kunne gi autocomplete manglerTilgangResult("perioder") */
function manglerTilgangResult<K extends string>(dataField: K): { [P in K]: null } & { manglerTilgang: true } {
    return { [dataField]: null, manglerTilgang: true } as { [P in K]: null } & { manglerTilgang: true };
}

/** For skrive-operasjoner (mutasjoner) — returnerer { ok: false, error: '...' } */
function tilgangNektetError(): { ok: false; error: string } {
    return { ok: false, error: 'Du har ikke tilgang til denne personen' };
}

export { manglerTilgangResult, tilgangNektetError };
