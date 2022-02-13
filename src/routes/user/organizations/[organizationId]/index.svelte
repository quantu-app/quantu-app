<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.params.organizationId);

		if (!browser && isValidStatus(response)) {
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
	import Organization from '$lib/components/UserOrganizations/Organization.svelte';
	import OrganizationLayout from '$lib/components/UserOrganizations/OrganizationLayout.svelte';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';

	export let organizationId: number;

	if (browser) {
		getOrganization(organizationId);
		setOrganizationIdAssets(organizationId);
	}

	$: organization = $userOrganizations.byId[organizationId];
</script>

<svelte:head>
	<title>{organization?.name}</title>
</svelte:head>

<OrganizationLayout
	{organizationId}
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/user/organizations`,
			title: 'My Organizations'
		},
		{
			href: `/user/organizations/${organizationId}`,
			title: organization?.name || 'Organization'
		}
	]}
>
	{#if organization}
		<Organization {organization} />
	{/if}
</OrganizationLayout>
