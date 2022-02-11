<script context="module" lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import AssetsModal from '$lib/AssetsModal.svelte';
	import { API_URL } from '$lib/constants';
	import '../app.scss';
	import AcceptCookies from '$lib/Compliance/AcceptCookies.svelte';

	OpenAPI.BASE = API_URL;
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
<AssetsModal />

<AcceptCookies />
