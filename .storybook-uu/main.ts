import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const apiMocks = path.resolve(configDirectory, '../tests/uu/stories/api-mocks.ts');

const config: StorybookConfig = {
    stories: ['../tests/uu/stories/Uu.stories.tsx'],
    framework: '@storybook/nextjs-vite',
    staticDirs: ['../public'],
    viteFinal: async (viteConfig) => {
        viteConfig.resolve ??= {};
        const existingAliases = Array.isArray(viteConfig.resolve.alias)
            ? viteConfig.resolve.alias
            : Object.entries(viteConfig.resolve.alias ?? {}).map(([find, replacement]) => ({ find, replacement }));
        viteConfig.resolve.alias = [
            { find: /^@\/lib\/api\/bekreftelse$/, replacement: apiMocks },
            { find: /^@\/lib\/api\/kartlegging$/, replacement: apiMocks },
            { find: /^@\/lib\/api\/kartlegging-enkeltperson$/, replacement: apiMocks },
            { find: /^@\/lib\/api\/oppslag-snapshot$/, replacement: apiMocks },
            { find: /^@\/lib\/tracking$/, replacement: apiMocks },
            ...existingAliases,
        ];
        return viteConfig;
    },
};

export default config;
