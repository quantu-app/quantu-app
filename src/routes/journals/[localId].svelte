<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({
		page: {
			params: { localId }
		}
	}) {
		return {
			props: {
				localId
			}
		};
	}
</script>

<script lang="ts">
	import { journals } from '$lib/state/journals';
	import Journal from '$lib/Journals/Journal.svelte';
	import Layout from '$lib/Layout.svelte';

	export let localId: string;

	$: journal = $journals[localId];
</script>

<svelte:head>
	<title>{journal?.name}</title>
</svelte:head>

<Layout>
	{#if journal}
		<Journal {localId} {journal} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		</div>
	{/if}
</Layout>
