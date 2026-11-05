import type { Preview } from '@storybook/nextjs-vite';
import { useEffect, useState, type ReactNode } from 'react';
import '../src/styles/globals.css';

function TestShell({
    children,
    scenario,
    hasPageHeading,
}: {
    children: ReactNode;
    scenario: string;
    hasPageHeading: boolean;
}) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        document.documentElement.lang = 'nb';
        document.title = `UU-test: ${scenario}`;
        setReady(true);
    }, [scenario]);

    return (
        <main lang='nb' data-uu-scenario={scenario} data-uu-ready={ready ? 'true' : undefined}>
            <div className='max-w-3xl mx-auto p-4'>
                {!hasPageHeading && <h1 className='text-2xl font-semibold mb-4'>{scenario}</h1>}
                {children}
            </div>
        </main>
    );
}

const preview: Preview = {
    parameters: {
        layout: 'fullscreen',
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/',
                query: {},
                segments: [],
            },
        },
    },
    decorators: [
        (Story, context) => (
            <TestShell
                scenario={context.name}
                hasPageHeading={context.parameters.uu?.hasPageHeading === true}
            >
                <Story />
            </TestShell>
        ),
    ],
};

export default preview;
