<script context="module" lang="ts">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				error,
				status
			}
		};
	}
</script>

<script lang="ts">
	import { dev } from '$app/env';
	import Layout from '$lib/components/Layout.svelte';

	export let error: Error;
	export let status: number;

	let lines = error.stack.split('\n');
	let firstLine = lines[0];
	let rest = lines.slice(1);
</script>

<Layout>
	<div class="container">
		<h1>{status} - {error.message}</h1>
		<p class="m-0">{firstLine}</p>
		{#if dev}
			{#each rest as line}
				<p class="m-0 ps-4">{line}</p>
			{/each}
		{/if}
	</div>
</Layout>
