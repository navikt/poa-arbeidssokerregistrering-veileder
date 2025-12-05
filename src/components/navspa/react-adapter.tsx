import { ReactElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

export interface ReactAdapter {
    render<P>(element: ReactElement<P>, container: HTMLElement): void;
    unmount<P>(container: HTMLElement): void;
}

export class React18Adapter implements ReactAdapter {
    private elementRootMap: Map<HTMLElement, Root> = new Map<HTMLElement, Root>();

    render<P>(component: ReactElement<P>, element: HTMLElement): void {
        const root = this.getRoot(element);
        root.render(component);
    }

    unmount<P>(element: HTMLElement): void {
        this.getRoot(element).unmount();
        this.elementRootMap.delete(element);
    }

    private getRoot(element: HTMLElement): Root {
        if (this.elementRootMap.has(element)) {
            return this.elementRootMap.get(element)!;
        } else {
            const root = createRoot(element);
            this.elementRootMap.set(element, root);
            return root;
        }
    }
}
