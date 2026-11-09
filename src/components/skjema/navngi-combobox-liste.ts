/** Aksel 8.20 mangler listenavn. Vurder behovet på nytt ved Aksel-oppgradering. */
function navngiComboboxListe(input: HTMLInputElement, root: HTMLElement, navn: string): () => void {
    const document = input.ownerDocument;
    if (!navn.trim() || !root.contains(input) || root === document.body || root === document.documentElement) {
        return () => {};
    }

    let avsluttet = false;
    const observer = new MutationObserver(oppdater);

    function oppdater() {
        if (avsluttet) return;
        // Egne attributtendringer skal ikke utløse en observer-løkke. Gamle mål kobles fra her.
        observer.disconnect();
        const beholdere = new Set(
            (input.getAttribute('aria-controls') ?? '')
                .split(/\s+/)
                .filter(Boolean)
                .map((id) => document.getElementById(id))
                .filter(
                    (element): element is HTMLElement =>
                        element !== null && element !== document.body && element !== document.documentElement,
                ),
        );

        for (const beholder of beholdere) {
            const lister = beholder.matches('[role="listbox"]')
                ? [beholder]
                : Array.from(beholder.querySelectorAll<HTMLElement>('[role="listbox"]'));
            // Ikke gjett hvilken liste som tilhører feltet hvis koblingen er tvetydig.
            if (lister.length !== 1) continue;
            const liste = lister[0];
            if (!liste) continue;
            const harNavn = ['aria-label', 'aria-labelledby', 'title'].some((attributt) =>
                liste.getAttribute(attributt)?.trim(),
            );
            if (!harNavn) liste.setAttribute('aria-label', navn);
        }

        // Eget område oppdager også en popup som monteres etter inputfeltet.
        observer.observe(root, { childList: true, subtree: true });
        observer.observe(input, { attributes: true, attributeFilter: ['aria-controls'] });
        for (const beholder of beholdere) {
            observer.observe(beholder, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-label', 'aria-labelledby', 'title', 'aria-controls'],
            });
        }
    }

    oppdater();
    return () => {
        avsluttet = true;
        observer.disconnect();
    };
}

export { navngiComboboxListe };
