import { render } from '@testing-library/react';

jest.mock('next/router', () => require('next-router-mock'));
import DineOpplysninger from './dine-opplysninger';

describe('tester komponenten DineOpplysninger', () => {
    test('komponenten rendrer som forventet', () => {
        const { container } = render(<DineOpplysninger />);
        expect(container).not.toBeEmptyDOMElement();
    });
});
