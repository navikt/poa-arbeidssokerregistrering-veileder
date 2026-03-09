import * as React from 'react';
import * as Feilmelding from './feilmelding';
import { createCustomEvent, getGlobal } from './utils';
import { ReactAdapter, React18Adapter } from './react-adapter';

interface DeprecatedNAVSPAScope {
    [name: string]: DeprecatedNAVSPAApp;
}

type DeprecatedNAVSPAApp = (element: HTMLElement, props: any) => void;

interface NAVSPAScope {
    [name: string]: NAVSPAApp;
}

export interface NAVSPAAppConfig {
    wrapperClassName?: string;
    feilmelding?: React.ReactNode;
}

type NAVSPAApp = {
    mount(element: HTMLElement, props: any): void;
    unmount(element: HTMLElement): void;
};

let reactAdapter: ReactAdapter = new React18Adapter();

const globalScope = getGlobal();
export const scope: DeprecatedNAVSPAScope = (globalScope['NAVSPA'] = globalScope['NAVSPA'] || {});
export const scopeV2: NAVSPAScope = (globalScope['NAVSPA-V2'] = globalScope['NAVSPA-V2'] || {});
export const exportEvent: string = 'NAVSPA-eksporter';

export function importer<P>(name: string, config?: NAVSPAAppConfig): React.ComponentType<P> {
    const appconfig: NAVSPAAppConfig = {
        ...(config ?? {}),
        feilmelding: config?.feilmelding === undefined ? <>Feil i {name}</> : config?.feilmelding,
    };

    let app: NAVSPAApp = scopeV2[name];
    if (!app) {
        if (scope[name]) {
            console.error(Feilmelding.v2Unmount(name));
        } else {
            console.error(Feilmelding.ukjentApp(name));
        }
        app = {
            mount: scope[name],
            unmount(element: HTMLElement) {
                reactAdapter.unmount(element);
            },
        };
    }

    const mounter = (props: P) => <NavSpa name={name} navSpaApp={app} navSpaProps={props} config={appconfig} />;

    return mounter;
}

interface NavSpaWrapperProps<P> {
    name: string;
    navSpaApp: NAVSPAApp;
    navSpaProps: P;
    config: NAVSPAAppConfig;
}

interface NavSpaState {
    hasError: boolean;
}

class NavSpa<P> extends React.Component<NavSpaWrapperProps<P>, NavSpaState> {
    private spaRootElement?: HTMLElement;

    constructor(props: NavSpaWrapperProps<P>) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    private renderImportedComponent() {
        try {
            if (this.spaRootElement) {
                this.props.navSpaApp.mount(this.spaRootElement, this.props.navSpaProps);
            }
        } catch (e) {
            this.setState({ hasError: true });
            console.error(e);
        }
    }

    public componentDidCatch(error: Error) {
        this.setState({ hasError: true });
        console.error(error);
    }

    public componentDidMount() {
        this.renderImportedComponent();
    }

    public componentDidUpdate(): void {
        if (!this.state.hasError) {
            this.renderImportedComponent();
        }
    }

    public componentWillUnmount() {
        if (this.spaRootElement) {
            this.props.navSpaApp.unmount(this.spaRootElement);
        }
    }

    public render() {
        if (this.state.hasError) {
            return <div className="navspa--applikasjonsfeil">{this.props.config.feilmelding}</div>;
        }
        return <div className={this.props.config.wrapperClassName} ref={this.saveRef} />;
    }

    private saveRef = (mountPoint: HTMLDivElement) => {
        this.spaRootElement = mountPoint;
    };
}
