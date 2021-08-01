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
	import { organizations } from '$lib/state/organizations';
	import Organization from '$lib/Organizations/Organization.svelte';
	import Layout from '$lib/Layout.svelte';

	export let localId: string;

	$: organization = $organizations[localId];
</script>

<svelte:head>
	<title>{organization?.name}</title>
</svelte:head>

<Layout>
	{#if organization}
		<Organization {localId} {organization} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		</div>
	{/if}
</Layout>
