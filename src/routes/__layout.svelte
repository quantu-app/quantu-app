<script context="module" lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import AssetsModal from '$lib/AssetsModal.svelte';
	import '../app.scss';

	OpenAPI.BASE = import.meta.env.VITE_API_URL;
</script>

<slot />

<AssetsModal />
