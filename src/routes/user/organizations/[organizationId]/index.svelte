<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = await authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

		if (response.status !== 302) {
			await getOrganization(organizationId);
		}

		return {
			...response,
			props: {
				organizationId
			}
		};
	}
</script>

<script lang="ts">
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import Organization from '$lib/UserOrganizations/Organization.svelte';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';

	export let organizationId: number;

	$: organization = $userOrganizations.byId[organizationId];
</script>

<svelte:head>
	<title>{organization?.name}</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	{#if organization}
		<Organization {organization} />
	{/if}
</OrganizationLayout>
