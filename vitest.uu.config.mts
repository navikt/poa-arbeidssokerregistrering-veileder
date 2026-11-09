import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config.mts';

const mergedConfig = mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            include: ['tests/uu/**/*.test.ts'],
            environment: 'jsdom',
            globals: false,
        },
    }),
);

export default {
    ...mergedConfig,
    test: {
        ...mergedConfig.test,
        include: ['tests/uu/**/*.test.ts'],
        environment: 'jsdom',
        globals: false,
    },
};
