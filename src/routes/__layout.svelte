<script context="module" lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import '../app.scss';

	OpenAPI.BASE = import.meta.env.VITE_API_URL as string;
</script>

<slot />
