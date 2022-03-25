import { test, expect } from '@playwright/test';

test('index page should load', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/QUANTU/);

	await expect(page.locator('text=Master Mathematics').first()).toBeVisible();

	await expect(page.locator('text=About us').first()).toHaveAttribute('href', '/info/about-us');
});
