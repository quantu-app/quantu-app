<script context="module" lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import AssetsModal from '$lib/AssetsModal.svelte';
	import { API_URL } from '$lib/constants';
	import '../app.scss';

	OpenAPI.BASE = API_URL;
</script>

<script>
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { currentUser, setUserSocket, socket } from '$lib/state/user';

	$: if (browser) {
		if (typeof window.gtag !== 'undefined') {
			window.gtag('config', 'G-8H9MTEL7XT', {
				page_path: `${$page.path}${$page.query ? '?' + $page.query : ''}`
			});
		}
		if ($currentUser && !$socket) {
			setUserSocket($currentUser.id, $currentUser.token);
		}
	}
</script>

<slot />
<AssetsModal />
