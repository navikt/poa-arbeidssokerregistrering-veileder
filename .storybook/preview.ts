import { mswLoader } from "msw-storybook-addon/csf3";
import type { Preview } from '@storybook/nextjs';
import '../src/styles/globals.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    // Provide the MSW addon loader globally
    loaders: [mswLoader()],
};

export default preview;
