declare module 'react/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            'ao-visittkort': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    fnr?: string;
                    enhet?: string;
                    tilbakeTilFlate?: string;
                    visVeilederVerktoy?: string;
                    skjulEtiketter?: string;
                    avsluttOppfolgingOpptelt?: string;
                },
                HTMLElement
            >;
        }
    }
}

export {};
