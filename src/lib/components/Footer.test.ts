/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import Footer from './Footer.svelte';
import { render } from '@testing-library/svelte';

describe('Test Footer', () => {
	test('Footer renders', () => {
		const component = render(Footer);
		expect(component.queryAllByText('Open Source Projects').length).toBeGreaterThan(0);
	});
});
