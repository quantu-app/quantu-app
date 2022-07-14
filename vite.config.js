import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: 'es2020'
	},
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	plugins: [sveltekit()]
};

export default config;
