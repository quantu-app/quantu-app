<script lang="ts" context="module">
	import { dev } from '$app/env';

	const googleTagID = 'G-99KHT730F3';

	if (typeof window !== 'undefined' && window && !dev) {
		window.dataLayer = window.dataLayer || [];
		function gtag(...args: any[]) {
			window.dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', googleTagID);
	}
</script>

<svelte:head>
	{#if !dev}
		<script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagID}`}></script>
	{/if}
</svelte:head>
