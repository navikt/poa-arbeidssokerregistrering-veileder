import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    test: {
        include: ['src/app/**/*.test.{ts,tsx}', 'src/proxy.test.ts'],
        exclude: ['node_modules', '.next'],
        environment: 'node',
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
