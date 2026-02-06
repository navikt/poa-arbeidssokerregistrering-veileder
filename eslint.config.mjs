import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    ...nextVitals,
    {
        ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/app/**'],
    },
];

export default eslintConfig;
