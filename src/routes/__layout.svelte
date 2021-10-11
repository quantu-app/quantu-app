<script context="module" lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import AssetsModal from '$lib/AssetsModal.svelte';
	import { API_URL } from '$lib/constants';
	import '../app.scss';

	OpenAPI.BASE = API_URL;
</script>

<slot />

<AssetsModal />
