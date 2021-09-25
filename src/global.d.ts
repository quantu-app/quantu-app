/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

import type bootstrap from 'bootstrap';
import type HLJSApi from 'highlight.js';
import type katex from 'katex';

declare global {
	interface ImportMetaEnv {
		VITE_API_URL: string;
		VITE_WS_URL: string;
	}

	interface Window {
		katex: katex;
		hljs: HLJSApi;
		bootstrap: bootstrap;
	}
}
