<script context="module" lang="ts">
	import '../app.scss';
	import AcceptCookies from '$lib/components/Compliance/AcceptCookies.svelte';
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/env';

	$: if (browser) {
		if (typeof window.gtag !== 'undefined') {
			window.gtag('config', 'G-8H9MTEL7XT', {
				page_path: `${$page.url.pathname}${$page.url.search ? '?' + $page.url.search : ''}`
			});
		}
	}
</script>

<slot />

<AcceptCookies />
