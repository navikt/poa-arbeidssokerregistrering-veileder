import { type RefObject, useEffect } from 'react';

export function useScrollSpy(sidebarRef: RefObject<HTMLElement | null>, sectionIds: string[]) {
    useEffect(() => {
        if (sectionIds.length === 0) return;

        const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

        if (sections.length === 0) return;

        const visibleSections = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        visibleSections.add(entry.target.id);
                    } else {
                        visibleSections.delete(entry.target.id);
                    }
                }

                const topmost = sectionIds.find((id) => visibleSections.has(id));
                if (!topmost || !sidebarRef.current) return;

                const links = sidebarRef.current.querySelectorAll('[data-nav-target]');
                for (const link of links) {
                    link.setAttribute(
                        'aria-current',
                        link.getAttribute('data-nav-target') === topmost ? 'true' : 'false',
                    );
                }
                const activeLink = sidebarRef.current.querySelector('[aria-current="true"]');
                if (activeLink) {
                    activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            },
            { rootMargin: '0px 0px -50% 0px', threshold: 0.1 },
        );

        for (const section of sections) {
            observer.observe(section);
        }

        return () => observer.disconnect();
    }, [sidebarRef, sectionIds]);
}
