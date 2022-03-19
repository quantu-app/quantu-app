/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 3000,
		timeout: 5 * 60 * 1000
	},
	testDir: 'tests'
};

export default config;
