import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Preview } from '@storybook/nextjs';
import '../src/styles/globals.css';

// Initialize MSW
initialize();

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
    loaders: [mswLoader],
};

export default preview;
