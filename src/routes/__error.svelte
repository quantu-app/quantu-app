<script context="module" lang="ts">
	export const load: Load = ({ error, status }) => {
		return {
			props: {
				error,
				status
			}
		};
	};
</script>

<script lang="ts">
	import { dev } from '$app/env';
	import GTag from '$lib/components/GTag.svelte';
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';
	import type { Load } from '@sveltejs/kit';

	export let error: Error;
	export let status: number;

	let lines = (error.stack || '').split('\n');
	let firstLine = lines[0];
	let rest = lines.slice(1);
</script>

<PublicLayout>
	<div class="container">
		<h1>{status} - {error.message}</h1>
		<p class="m-0">{firstLine}</p>
		{#if dev}
			{#each rest as line}
				<p class="m-0 ps-4">{line}</p>
			{/each}
		{/if}
	</div>
</PublicLayout>

<GTag />
