import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-docs',
        'msw-storybook-addon'
    ],
    framework: '@storybook/nextjs-vite',
    staticDirs: ['../public'],
};
export default config;
