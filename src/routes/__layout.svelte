<script context="module" lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import Notifications from '$lib/Notifications.svelte';
	import '../app.scss';

	OpenAPI.BASE = import.meta.env.VITE_QUANTU_API_URL;
</script>

<Notifications />

<slot />
