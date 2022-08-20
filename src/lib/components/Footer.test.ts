/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import Footer from './Footer.svelte';
import { render } from '@testing-library/svelte';

describe('Test Footer', () => {
	test('Footer renders', () => {
		const component = render(Footer as any);

		// test footer links
		const footerLinks = [
			{ text: "About us", link: "/info/about-us" },
			{ text: "Principles", link: "/info/principles" },
			{ text: "Roadmap", link: "https://trello.com/b/DrtlVKXH/product-roadmap" },
			{ text: "Open Source Projects", link: "https://github.com/quantu-app" },
		];

		for (let i = 0; i < footerLinks.length; i++) {
			const item = footerLinks[i];
			const domNode = component.getByText(item.text);
			expect(domNode.closest("a")).toHaveAttribute("href", item.link);
		}

	});
});
