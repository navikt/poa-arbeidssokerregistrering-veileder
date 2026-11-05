# UU-testing

UU-testene skal finne tilgjengelighetsfeil før endringer tas i bruk. Testene kjører lokalt med Playwright og axe. De er foreløpig ikke koblet til CI. Eksisterende Vitest-tester og CI-kommandoer beholdes.

En grønn kjøring betyr at de automatiske kontrollene består i de testede tilstandene. Den betyr ikke at løsningen oppfyller alle WCAG-krav. Manuell testing og vurdering av brukerflytene er fortsatt nødvendig.

## Status og gjennomgåtte resultater

Demokomponentene er fjernet fra appen. Testoppsettet har derfor ikke lenger en hjelper som skjuler dem, eller tester av denne hjelperen. Den særskilte nettlesertesten av demohurtigvalgene er også fjernet. Mockmodus og testene av appens funksjoner er beholdt.

Etter oppryddingen registreres 52 nettlesertester og 22 hjelpetester, mot tidligere 53 og 29. Nedgangen skyldes at én nettlesertest av demohurtigvalgene og sju tester av den slettede hjelperen er fjernet, ikke at UU-kravene til appen er svekket. Testlisting er ikke en nettleserkjøring og sier ikke hvilke tester som består.

I en tidligere nettleserkjøring, før denne oppryddingen, bestod 50 av 53 tester. De tre gjenværende feilene gjaldt combobox-listens tilgjengelige navn og fokus etter navigasjon til sidene for avsluttet og slettet periode. Dette var før de siste rettelsene av listeboksnavn og kvitteringsfokus. Disse rettelsene er implementert og komponenttestet, men må verifiseres i en ny nettleserkjøring.

Test-riggen hadde blant annet for strenge tekstselektorer, feil rolle for historikkens Aksel-bryter og en uriktig forventning om Tab-rekkefølgen. Disse forholdene må skilles fra produktfunn som manglende gruppenavn, fokustap og axe-brudd.

En tidligere rapport viste også at `/kvittering-arbeidssoker` krasjet i `TrackAktivitet` med `Cannot read properties of undefined (reading 'onClick')`. Riggen skal stoppe testen med en tydelig melding ved en slik renderingsfeil, og ikke godta feilsiden som en bestått kvitteringstest.

### Applikasjonsrettelser etter funnene

Listen under beskriver de første applikasjonsrettelsene, som er komponenttestet og inngikk i nettleserkjøringen der 50 av 53 tester bestod. De siste rettelsene av listeboksnavn og fokus på kvitteringene for avsluttet og slettet periode omtales separat nedenfor. Dette er ikke en full manuell UU-vurdering.

- Kvitteringslenken rendres direkte som en Aksel-lenke i klientkomponenten. Den inspiserer og kloner ikke lenger et barn som er sendt fra en serverkomponent. Lenketekst, mål og sporingshendelse er beholdt.
- Forsiden har fått en hovedoverskrift. Skjemaseksjonene og historikkens sideoverskrift har fått riktige nivåer under sidens hovedoverskrift.
- Jobbvalgene har fått et gruppenavn. Feilmeldingen vises også når et påkrevd jobbvalg fortsatt har verdien `INGEN_SVAR`, i samsvar med den eksisterende registreringsvalideringen.
- Ugyldig innsending flytter fokus til første ugyldige felt i skjemaet. Åpning av stillingssøk fokuserer søkefeltet, og valg av stilling gir fokus tilbake til «Endre». Vanlig Tab-navigasjon ut av søket skal ikke trekke fokus tilbake.
- Bekreftelsens kvitteringsoverskrift får fokus når den erstatter innsendingshandlingen. Ved overgang til neste bekreftelsesperiode fokuseres det nye spørsmålets første radiovalg.
- «Avbryt» og inngangen til bekreftelser rendres som én lenke hver, uten en knapp inni lenken.
- Informasjonskortet og navigasjonslenkene på forsiden kan stables ved smal skjermbredde. Innhold skjules eller klippes ikke for å få breddetesten til å bestå.

Registreringsregler, innsending, API-payloads, auth, rotlayout og CI er ikke endret av disse rettelsene. Komponenttester i jsdom beviser ikke at reflow, skjermleseropplesning eller server-/klientsammensettingen fungerer i en ekte nettleser.

Ved kontroll av demooppryddingen bestod 390 enhets- og komponenttester og 22 hjelpetester for UU-riggen. Etter den separate lintoppryddingen består `pnpm lint` uten feil eller advarsler, og TypeScript-sjekken består. Den siste enhetstestkjøringen har 389 beståtte tester og én feil i testen av raskt person- og enhetsbytte i `forside.test.tsx`. Hjelpetestene består fortsatt. `useServerData.ts` er ikke endret av lintoppryddingen, og testfeilen må følges opp separat.

### Funn som fortsatt må avklares

- Aksel 8.20 rendrer en `ul[role="listbox"]` uten tilgjengelig navn i `UNSAFE_Combobox` og tilbyr ingen prop for å navngi listen. Stillingssøket bruker nå en avgrenset kompatibilitetsrettelse. Den følger bare søkefeltets `aria-controls`, finner den tilhørende listeboksen og gir den samme tilgjengelige navn som søkefeltet hvis navneattributter mangler. Eksisterende navn og roller beholdes. Endringer i den tilhørende listen observeres lokalt, med opprydding når søket avmonteres. Axe-regelen er fortsatt aktiv. Testene bruker Aksels faktiske komponent og kontrollerer også at et annet søk ikke påvirkes og at listen beholder navnet ved søkefeil. Ved en senere Aksel-oppgradering må behovet vurderes på nytt og rettelsen fjernes hvis den ikke lenger trengs. Nettleserverifisering gjenstår.
- Fokus på `body` etter full ruteendring er ikke alene bevis på et WCAG-brudd. I denne flyten har sidene samme dokumenttittel, mens den installerte Next.js-versjonens ruteannonsering bare reagerer på tittelendringer. Kvitteringene for avsluttet og slettet periode fokuserer derfor nå sin faktiske hovedoverskrift. Fokus flyttes når kvitteringen monteres eller teksten endres, ikke ved uendret gjengivelse. Dette er avgrenset til de to kvitteringene, ikke alle ruteendringer. Nettlesertestene krever nå fokus på den konkrete overskriften, ikke bare at fokus er borte fra `body`. Skjermleseropplesning og tastaturflyt må fortsatt vurderes manuelt.
- Nettlesertestene må kjøres på nytt etter rettelsene av combobox-listen og kvitteringsfokus. Rapporten fra kjøringen med 50 beståtte tester er ikke en verifisering av disse siste endringene.

Nettleserrapporten i `playwright-report/` beskriver kjøringen som laget den. Endring av testkode oppdaterer ikke rapporten. Den må genereres på nytt med en ny nettleserkjøring før du vurderer resultatene etter endringer i riggen.

Under en tidligere retting skrev Playwrights HTML-reporter utilsiktet over rapporten ved `--list`. En senere nettleserkjøring erstattet testlisten med nye resultater. Konfigurasjonen er rettet slik at vanlig testlisting bare bruker konsollrapportering og ikke skriver HTML. Trace- og feilkontekstfiler fra den siste nettleserkjøringen ligger i `test-results/uu/`.

Implementerte Playwright-tester ligger i `forms.spec.ts`, `navigation.spec.ts`, `routes.spec.ts` og `layout.spec.ts` under `tests/uu/`. Storybook-scenarioene finnes som testgrunnlag, men egne automatiserte tilstandstester for dem er ikke implementert ennå. Det finnes heller ingen `states.spec.ts` eller `rig.spec.ts`. Kontoroversikt og person- og enhetsbytte er dermed ikke dekket av nettlesertestene ennå.

## Kjør testene lokalt

Bruk Node-versjonen fra `.nvmrc`. Ikke start testene mot et produksjonsmiljø eller med virkelige personopplysninger.

```bash
source "$HOME/.nvm/nvm.sh"
nvm use
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:uu
```

Testene starter sine egne servere på `127.0.0.1:3100` (Next.js) og `127.0.0.1:6106` (isolert Storybook). Storybook-serveren brukes foreløpig ikke av noen implementert test. Portene må være ledige. Testene gjenbruker ikke en app du allerede har startet. Første kjøring bruker tid på kompilering.

```bash
# Vis hvilke tester som finnes, uten å starte servere eller nettleser.
pnpm test:uu --list

# Kjør en del av testene.
pnpm test:uu tests/uu/forms.spec.ts

# Åpne den siste HTML-rapporten.
pnpm test:uu:report

# Kjør med Playwrights interaktive grensesnitt.
pnpm test:uu:ui

# Kontroller serverens testspesifikke nettverksmodul uten nettleser.
node --test tests/uu/network.test.mjs

# Kjør regresjonstestene for test-riggens hjelpere uten nettleser eller appserver.
pnpm test:uu:helpers
```

Chromium er standard. Installer og velg flere nettlesere når du vil undersøke forskjeller mellom nettlesermotorene:

```bash
pnpm exec playwright install firefox webkit
UU_ALL_BROWSERS=1 pnpm test:uu
```

Playwright WebKit erstatter ikke manuell testing i Safari med VoiceOver. Playwright Chromium erstatter heller ikke NVDA i et faktisk Windows-oppsett.

## Testmiljø og avgrensning

Testene bruker ekte applikasjonskomponenter, ikke erstatninger for skjemafelt eller Aksel-komponenter.

- Next.js kjører med både `ENABLE_MOCK=enabled` og `NEXT_PUBLIC_ENABLE_MOCK=enabled`. Cluster-navnet er `local-uu`.
- Serverkall bruker appens eksisterende mockgrener. En testspesifikk nettverksmodul erstatter oppslag av visittkortmanifestet og avviser andre eksterne server-fetch-kall.
- Stillingssøk får kontrollerte nettverkssvar i nettlesertestene. Testene skal ikke sende søk til PAM Ontologi.
- Storybook-konfigurasjonen i `.storybook-uu/` gjør flere tilstander tilgjengelige med testdata og erstatninger for serverfunksjonene. Den endrer ikke vanlig Storybook eller appens produksjonsoppsett.
- Dekoratør og visittkort vises ikke i mockmodus. Disse inngår derfor ikke i den lokale sidetestingen.
- Next.js sitt utviklerpanel er verktøygrensesnitt, ikke produktinnhold. Testoppsettet skjuler dette panelet. Applikasjonsinnhold skal ikke skjules eller ekskluderes for å få testene grønne.
- Aksel-fontene hentes fra en avgrenset CDN-adresse. Nettverks- og fontfeil skal ikke tolkes som en bestått UU-kontroll.

Bruk bare testdata. Rapporter, skjermbilder og traces kan inneholde alt som vises i grensesnittet, og traces kan også inneholde nettverkstrafikk. Resultatkatalogene er ignorert av Git. Ikke del rapporter fra andre miljøer uten å kontrollere innholdet.

## Hva som testes automatisk

### Axe-skanning

Axe kjører mot ferdig rendret innhold og etter utvalgte tilstandsendringer. Skanningen bruker standardsettet med stabile regler og aktiverer i tillegg `target-size`. Denne regelen er stabil, men er ikke aktivert som standard i axe 4.14. Skanningen filtrerer ikke på alvorlighetsgrad og bruker ingen liste som godtar eksisterende brudd. Eksperimentelle, utgåtte og ekstra AAA-regler aktiveres ikke.

Reglene omfatter blant annet:

- manglende tilgjengelige navn på knapper og skjemafelt
- ugyldige ARIA-attributter og enkelte feil i ARIA-relasjoner
- tekstkontrast der verktøyet kan beregne den
- enkelte feil i semantikk, tabeller, landemerker og dokumentstruktur
- regler for minstestørrelse på pekermål som den installerte axe-versjonen støtter

Regelsettet inneholder både WCAG-kontroller og beste praksis. WCAG 2.1 A/AA er utgangspunktet. Relevante automatiske WCAG 2.2-kontroller kommer i tillegg. Et funn må vurderes ut fra regelen og kriteriet det gjelder, ikke bare testnavnet.

Hele axe-resultatet legges ved rapporten. `violations` gir testfeil. `incomplete` betyr at axe trenger en menneskelig vurdering. Disse resultatene skal gjennomgås, ikke regnes som bestått. `inapplicable` betyr at regelen ikke traff noe i den aktuelle tilstanden, ikke at hele WCAG-kriteriet er irrelevant for appen.

### Sider og tilstander

Sideregistret i `tests/uu/routes.ts` angir hvilke ruter testene besøker og hvilket innhold de venter på. En synlig sidetittel alene er ikke bevis på at dataene er ferdig lastet.

| Side | Grunntilstand i den ekte appen |
| --- | --- |
| `/` | Personvisning med mockdata |
| `/registrering-arbeidssoker` | Registreringsskjema |
| `/registrering-arbeidssoeker-sjekk` | Avvisning med veilederens vurderinger |
| `/oppdater-opplysninger` | Utfylt opplysningsskjema |
| `/bekreftelse` | Bekreftelsesskjema |
| `/tidslinjer` | Perioder med hendelser |
| `/historikk` | Historikk med perioder og filtre |
| `/avslutt-arbeidssoekerperiode` | Avslutning av periode |
| `/slett-arbeidssoekerperiode` | Bekreftelse før sletting |
| `/arbeidssoekerperiode-er-avsluttet` | Kvittering |
| `/arbeidssoekerperiode-er-slettet` | Kvittering |
| `/kvittering-arbeidssoker` | Kvittering |
| `/kvittering-oppdatert-opplysninger` | Kvittering |
| `/veiledning/mangler-tilgang-til-aa-registeret` | Veiledning |
| Ukjent rute | 404-side |

Den generelle feilkomponenten kan testes isolert i Storybook. Å rendre `error.tsx` der undersøker komponenten, ikke at en error boundary i Next.js faktisk fanger en serverfeil. `/feil` er ikke en egen feilrute i denne appen.

Storybook-scenarioene gjør kontoroversikt, person- og enhetsbytte, tomme resultater, manglende tilgang, lesefeil, innsendingsfeil og lasting tilgjengelig for testing. De viser også innholdet i «Hva er nytt», som normalt er slått av i mockmodus. Scenarioene skannes foreløpig ikke av Playwright-testene. De er heller ikke en test av Unleash-integrasjonen.

### Tastatur og fokus

Interaksjonstestene bruker tastetrykk for å nå og betjene kontroller. De skal kontrollere ønsket oppførsel, ikke godta dagens fokustap som forventet resultat.

| Område | Automatisk kontroll | Hva kontrollen ikke beviser |
| --- | --- | --- |
| Registrering og oppdatering | Betjening av faktiske felt, betingede spørsmål og innsending | At spørsmålene er forståelige for en veileder |
| Feltfeil | Feiltilknytning og fokus ved ugyldig innsending | At skjermleseren formidler feilen tydelig |
| Stillingssøk | Åpning, søk, valg, feil og fokus når feltet erstattes | Hele skjermleseropplevelsen i comboboxen |
| Bekreftelser | Radiovalg, advarsel, innsending, kvittering og neste periode | At konsekvensen av svaret er forstått |
| Avslutning og sletting | Tastaturbetjening og overgang til kvittering | At brukeren forstår forskjellen mellom handlingene |
| Historikk og tidslinje | Menyer, filtre og utvidet innhold | At leserekkefølgen fungerer godt med hjelpemidler |
| Kontoroversikt | Storybook-scenarioer med styrte testdata finnes, men skannes ikke ennå | Ingen automatisk UU-skanning eller tastaturflyt i nettleser er verifisert |

Testene kontrollerer også utvalgte strukturelle egenskaper som positiv `tabindex`, nestede interaktive elementer, hovedområde og overskrifter. «Én hovedoverskrift» og et avtalt overskriftshierarki er prosjektets kvalitetsregler. Flere `h1` er ikke alene bevis på et WCAG-brudd.

### Visning og tilpasning

Visningstestene undersøker smal bredde og dokumentoverflyt. Tekstavstand, større tekst, tvungne farger og redusert bevegelse gir supplerende testgrunnlag og skjermbilder.

Noen visuelle kontroller er heuristikker: de finner mistenkelige forhold, men kan ikke avgjøre om resultatet er tilgjengelig. Se vedleggene i rapporten og gjennomgå kandidatene manuelt.

- Et viewport på 320 CSS-piksler undersøker reflow. Det er ikke en faktisk test av nettleserzoom på 400 %.
- Dobbel rotfontstørrelse er en stresstest av tekst, ikke det samme som 200 % nettleserzoom. Tekst med andre størrelsesenheter påvirkes ikke nødvendigvis.
- Tekstavstand testes med linjehøyde 1,5, bokstavavstand 0,12 em, ordavstand 0,16 em og avsnittsavstand 2 em.
- `forced-colors` i Chromium er en emulering. Den beviser ikke at appen fungerer i Windows-kontrasttema.
- En beregnet `outline` eller et skjermbilde beviser ikke at fokusmarkeringen er synlig og tydelig mot alle bakgrunner.
- Tabeller kan ha legitim todimensjonal rulling. Dette gir ikke et generelt unntak for overflyt i resten av siden.

### Eksisterende Vitest- og lintkontroller

`pnpm test` kjører fortsatt de eksisterende enhets- og komponenttestene. Flere bruker roller og tilgjengelige navn. Disse er nyttige regresjonstester, men erstatter ikke nettlesertestene. Opplysningsskjemaets eksisterende orkestreringstest erstatter underkomponenter med stubber og undersøker derfor ikke de faktiske feltene.

`pnpm lint` kjører Biome, inkludert anbefalte tilgjengelighetsregler. Statisk analyse kan ikke kontrollere ferdig sammensatt UI eller fokusflyt. Den eksisterende CI-workflowen endres ikke av UU-oppsettet.

## Les og behandle resultatene

1. Åpne HTML-rapporten etter kjøringen.
2. Skill mellom testmiljøfeil og produktfunn. Manglende nettleser, server som ikke starter, feil selektor eller manglende fixture er ikke et UU-funn.
3. Les axe-regel, berørt element, tilstand og forslag til vurdering. Gjenskap produktfunnene i nettleseren.
4. Gjennomgå alle `incomplete` og visuelle vedlegg. Registrer konklusjonen og begrunnelsen.
5. Rett bekreftede produktfeil i en separat endring. Kjør den aktuelle testen på nytt og deretter hele UU-suiten.

Ikke bruk `skip`, `fixme`, forventet testfeil eller brede ekskluderinger for å få en grønn rapport. Et nødvendig midlertidig unntak må beskrive nøyaktig element, regel, årsak, ansvarlig og tidspunkt for ny vurdering.

Kildekodegjennomgangen før testoppsettet fant flere forhold som testene skal undersøke: knapp inni lenke, flere hovedoverskrifter, radiogruppe uten `legend`, generisk ikonnavn og mulig fokustap i stillingssøk og ved validering. Ikke behandle hele listen som ferdig verifiserte nettleserfunn. Rapporten fra den aktuelle kjøringen viser hva som faktisk ble undersøkt. Se statusdelen for skillet mellom testfeil og produktfunn.

## Hva som må testes manuelt, og hvordan

Bruk testpersoner i dev når du trenger den ekte Modia-integrasjonen. Test alle sentrale oppgaver: finne en person, registrere, endre opplysninger, bekrefte, lese historikk og tidslinje, avslutte og slette en periode. Ta med feil og veien tilbake til en fungerende tilstand.

### Tastatur uten mus

1. Last siden på nytt. Bruk bare Tab, Shift+Tab, Enter, mellomrom, piltaster og Escape.
2. Gå fra dekoratøren og visittkortet til appens hovedinnhold. Kontroller eventuell hopp-lenke.
3. Fullfør oppgaven. Åpne og lukk alle relevante menyer, hjelpetekster og søk.
4. Utløs en feil og rett den. Kontroller også avbrudd, tilbake-navigasjon og kvittering.

Bestått når alle handlinger er tilgjengelige, rekkefølgen er forståelig, fokus er synlig og ikke dekket, og det ikke finnes tastaturfeller. Etter at et felt eller en meny forsvinner, skal fokus være på et forståelig sted. Automatiske tastaturtester dekker bestemte sekvenser, ikke alle mulige veier gjennom UI-et.

### Skjermleser

Bruk NVDA med Chrome eller Firefox i Windows og VoiceOver med Safari på Mac. Registrer nøyaktige versjoner. På Mac aktiveres VoiceOver med Command+F5; kontroller også systemets innstilling for full tastaturnavigasjon.

1. Les sidetittelen og naviger med overskrifter og landemerker.
2. Gå gjennom feltene. Kontroller at navn, gruppespørsmål, valgt verdi, beskrivelse og feil blir formidlet i riktig sammenheng.
3. Bruk stillingssøk med tastatur. Kontroller søkestatus, forslag, aktivt forslag og valgt stilling.
4. Utløs valideringsfeil og en innsendingsfeil. Kontroller at du oppdager feilen uten å lete tilfeldig på siden.
5. Send inn og gå til neste bekreftelse. Kontroller at kvitteringen og det nye spørsmålet blir oppdaget.
6. Les kontoroversikten og historikken. Kontroller sammenhengen mellom rad, kolonne, sortering, filtervalg og innhold.
7. Bytt person og enhet. Kontroller at kontekstendringen er forståelig, og at gammel informasjon ikke blir lest som den nye personens informasjon.

Bestått når du kan forstå og fullføre oppgaven uten å se skjermen. At en live-region eller et ARIA-attributt finnes, beviser ikke at riktig informasjon blir lest opp til riktig tid.

### Zoom, tekst og reflow

1. Bruk en vanlig desktopbredde, for eksempel 1280 CSS-piksler, og test ekte nettleserzoom på 200 % og 400 %.
2. Åpne menyer, skjemafeil, stillingssøk og historikk i den forstørrede visningen.
3. Kontroller at tekst og kontroller ikke klippes, overlapper eller forsvinner. Kontroller at klebrige elementer ikke dekker innhold eller fokus.
4. Test tekstavstandene beskrevet over, og større standardtekst i nettleseren.
5. Undersøk tabeller separat. Eventuell todimensjonal rulling skal være nødvendig for innholdet og kunne betjenes med tastatur.

Bestått når du fortsatt kan lese, nå og bruke innholdet. Skjermbilder og geometrimålinger er støtte, ikke en full vurdering.

### Kontrast, farge og fokusmarkering

Bruk et kontrastverktøy på tekst, men også på meningsbærende ikoner, feltgrenser og fokusmarkering. Sjekk vanlig, valgt, hover-, fokus- og feiltilstand. Tekst krever normalt minst 4,5:1; stor tekst minst 3:1. Relevante ikke-tekstlige komponenter og tilstander krever minst 3:1 mot tilstøtende farger.

Undersøk at advarsler og status kan forstås uten farge alene. Test i et faktisk Windows-kontrasttema. Kontroller at knapper, radiovalg, valgt filter og fokus fortsatt kan skilles fra bakgrunnen. Vurder unntak ut fra WCAG-kriteriet, ikke ved å anvende kontrastkravet ukritisk på alle elementer.

### Pekermål og innhold ved hover eller fokus

Undersøk små ikonknapper, filterknapper og paginering med mus og berøring der det er relevant. WCAG 2.2s minstestørrelse på pekermål er 24 × 24 CSS-piksler, med definerte unntak, blant annet for avstand og lenker i løpende tekst. Mål og vurder unntaket før du registrerer et brudd.

Åpne tooltips og annet ekstra innhold både med peker og tastatur. Kontroller at innholdet kan oppdages, holdes åpent og lukkes uten at du mister nødvendig kontekst. Kontroller at meningsbærende ikoninformasjon ikke bare finnes i en hover-tekst.

### Språk, struktur og konsekvenser

Les overskrifter, lenkenavn, feltetiketter og feilmeldinger i sammenheng. Vurder om navnene beskriver handlingen, om feil kan rettes, og om veilederen forstår forskjellen mellom avslutning og sletting. Kontroller at status og konsekvenser ikke bare uttrykkes med ikoner.

Automatikk kan finne et manglende navn, men ikke avgjøre om et eksisterende navn er nyttig. Brukertesting med veiledere og brukere av hjelpemidler er nødvendig for å vurdere hele arbeidsflyten.

### Områder som krever ny vurdering ved endringer

Det nåværende testoppsettet er ikke en full gjennomgang av WCAG. Tidsgrenser, reautentisering, avbrudd, bevegelse, pekergester og eventuell dra-og-slipp må vurderes når de inngår i en brukerflyt. Appens innlogging og felles Modia-komponenter ligger utenfor de lokale mocktestene.

For lyd, video og andre funksjoner som ikke er representert i testscenarioene, skal dere registrere om kriteriene er relevante. Fravær av en test er ikke dokumentasjon på at et kriterium ikke gjelder. Ved nye funksjoner må testmatrisen oppdateres.

## Registrer manuelle resultater

Bruk én rad per kontrollert oppgave eller funn. Ikke fyll ut «bestått» uten en gjennomført kontroll.

| Dato og tester | Commit og miljø | Nettleser og hjelpemiddel | Rute og tilstand | Fremgangsmåte | Forventet og observert resultat | Funn eller oppfølging |
| --- | --- | --- | --- | --- | --- | --- |
| Ikke gjennomført | | | | | | |

Kjør manuelle kontroller ved endringer i navigasjon, skjemaer, fokus, layout og felles komponenter, og før dere bruker testoppsettet som grunnlag for en tilgjengelighetsvurdering. Gjennomgå relevante `incomplete` etter hver automatisk kjøring.

## Vedlikehold

Når en side eller en ny UI-tilstand legges til, oppdater ruteregistret eller scenarioene og legg til forventninger for tastatur og fokus. En ny type tilgjengelighetsfeil bør få en regresjonstest dersom den kan kontrolleres automatisk.

Hold Playwright-nettlesere og axe-versjon i samsvar med lockfilen. Endringer i regelsett kan avdekke nye feil selv om appkoden er uendret. Les funnene før du endrer forventningene.

CI-integrasjon vurderes separat når den lokale riggen er verifisert og produktfunnene er håndtert. Ingen CI-, Nais- eller auth-endringer er en del av dette oppsettet.

## Kilder

- [Playwright: Accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [W3C: Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C: Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C: Understanding Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
