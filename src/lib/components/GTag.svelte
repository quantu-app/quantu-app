<script lang="ts" context="module">
	import { dev } from '$app/env';
	let gtag = (...args: any[]) => undefined;

	if (typeof window !== 'undefined' && dev) {
		window.dataLayer = window.dataLayer || [];
		gtag = function (...args: any[]) {
			window.dataLayer.push(arguments);
		};
		gtag('js', new Date());
		gtag('config', 'G-99KHT730F3');
	}
</script>

<svelte:head>
	{#if !dev}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-99KHT730F3"></script>
	{/if}
</svelte:head>
