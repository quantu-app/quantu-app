<script lang="ts">
	import PageLoading from '$lib/components/ui/PageLoading.svelte';
	import AcceptCookies from '$lib/components/AcceptCookies.svelte';
</script>

<slot />

<AcceptCookies />
<PageLoading />
