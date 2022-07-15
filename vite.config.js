import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	ssr: {
		noExternal: [/^svelte-slate?\//]
	},
	plugins: [sveltekit()]
};

export default config;
