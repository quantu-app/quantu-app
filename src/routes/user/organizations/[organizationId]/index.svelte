<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = await authGuard(input);

		return {
			...response,
			props: {
				organizationId: parseInt(input.page.params.organizationId)
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
