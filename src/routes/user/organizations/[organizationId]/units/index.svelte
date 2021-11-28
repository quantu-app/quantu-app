<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getUnits(organizationId), getOrganization(organizationId)]);
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
	import { getUnits, organizationUnits } from '$lib/state/organizationUnits';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Units from '$lib/UserOrganizations/Units/Units.svelte';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';

	export let organizationId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: units = Object.values($organizationUnits.byOrganizationId[organizationId] || {});

	if (browser) {
		getOrganization(organizationId);
		getUnits(organizationId, undefined, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>Units</title>
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
		},
		{
			href: `/user/organizations/${organizationId}/units`,
			title: 'Units'
		}
	]}
>
	<Units {organizationId} {units} />
</OrganizationLayout>
