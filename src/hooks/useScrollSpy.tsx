import { useEffect, useState } from 'react';

interface UseScrollSpyOptions {
    sectionIds: string[];
    rootMargin?: string;
    threshold?: number;
}

/**
 * En Hook som tar inn en liste av alle seksjons-idene som skal sjekkes.
 * Den returnerer ID-en til den aktive seksjonen som er synlig på skjermen,
 * dersom det er flere, så returneres den første (øverste).
 */
export const useScrollSpy = ({ sectionIds, rootMargin = '0px 0px -50% 0px', threshold = 0.1 }: UseScrollSpyOptions) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);

                if (visibleSections.length > 0) {
                    // Når flere er synlige, velg den første
                    const firstVisibleSection = sectionIds.find((id) => visibleSections.includes(id));
                    if (firstVisibleSection) {
                        setActiveSection(firstVisibleSection);
                    }
                }
            },
            {
                rootMargin,
                threshold,
            },
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [sectionIds, rootMargin, threshold]);

    return activeSection;
};
