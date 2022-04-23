<svelte:options immutable />

<script lang="ts">
	import Robots, { type TagDirective } from './Robots.svelte';
	import OpenGraph from './OpenGraph.svelte';
	import Twitter from './Twitter.svelte';

	export let title: string = undefined;
	export let description: string = undefined;
	export let keywords: string = undefined;
	export let canonical: string = undefined;
	export let robotsDirectives: TagDirective[] = [];
	export let openGraph: object = undefined;
	export let twitter: object = undefined;
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
	{#if robotsDirectives.length > 0}
		<Robots directives={robotsDirectives} />
	{/if}
	{#if openGraph}
		<OpenGraph {...openGraph} />
	{/if}

	{#if twitter}
		<Twitter {...twitter} />
	{/if}
</svelte:head>
