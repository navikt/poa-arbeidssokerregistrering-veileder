export const ukjentApp = (app: string) =>
    `
NAVSPA-appen '${app}' er ikke lastet inn.

Lastet vha script tags: 
  Sjekk at script-tagen for navspa-appen ligger ovenfor applikasjons script-taggen.
  Dette for å sikre at navspa-appen blir lastet inn før applikasjonen deres forsøker å bruke den. 

Lastet vha async:
  Sjekk at urlene som blir forsøkt lastet inn ser riktige ut. 
  E.g henters asset-manifest fra riktig sted, og gjøres utledning av assets-urlene riktig.
`.trim();

export const v2Unmount = (app: string) =>
    `
NAVSPA-appen '${app}' bruker en eldre versjon av NAVSPA for eksportering.
Denne har ett kjent problem med unmounting av komponenten, og det er derfor anbefalt å oppdatere til nyeste versjon.
`.trim();

export const asyncLoadingOfDefinedApp = (app: string) =>
    `
NAVSPA-appen '${app}' ser ut til å være lastet inn via statiske script/link tags fra før av.
Man kan derfor bruke synkron innlasting av denne appen, eller fjerne innlastingen fra index.html.
`.trim();
