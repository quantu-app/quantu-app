<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({
		page: {
			params: { organizationId }
		}
	}) {
		return {
			props: {
				organizationId: parseInt(organizationId)
			}
		};
	}
</script>

<script lang="ts">
	import { currentUser } from '$lib/state/user';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import Organization from '$lib/UserOrganizations/Organization.svelte';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';

	export let organizationId: number;
	let prevOrganizationId: number;

	$: organization = $userOrganizations.byId[organizationId];

	$: if ($currentUser && organizationId !== prevOrganizationId) {
		prevOrganizationId = organizationId;
		getOrganization(organizationId);
	}
</script>

<svelte:head>
	<title>{organization?.name}</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	{#if organization}
		<Organization {organization} />
	{/if}
</OrganizationLayout>
