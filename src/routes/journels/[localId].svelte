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
	import { journels } from '$lib/state/journels';
	import Journel from '$lib/Journels/Journel.svelte';
	import Layout from '$lib/Layout.svelte';

	export let localId: string;

	$: journel = $journels[localId];
</script>

<svelte:head>
	<title>{journel?.name}</title>
</svelte:head>

<Layout>
	{#if journel}
		<Journel {localId} {journel} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		</div>
	{/if}
</Layout>
