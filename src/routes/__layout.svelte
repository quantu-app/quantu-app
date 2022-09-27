<script context="module" lang="ts">
	import '../app.scss';
	import AcceptCookies from '$lib/components/AcceptCookies.svelte';
</script>

<script lang="ts">
	import PageLoading from '$lib/components/ui/PageLoading.svelte';
</script>

<slot />

<AcceptCookies />
<PageLoading />
