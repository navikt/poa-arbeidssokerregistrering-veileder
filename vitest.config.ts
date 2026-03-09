import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    test: {
        include: ['src/**/*.test.{ts,tsx}', 'src/proxy.test.ts'],
        exclude: ['node_modules', '.next'],
        environment: 'node',
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'server-only': path.resolve(__dirname, './src/test/server-only-stub.ts'),
        },
    },
});
