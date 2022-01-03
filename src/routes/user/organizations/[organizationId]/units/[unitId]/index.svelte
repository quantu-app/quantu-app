<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.params.organizationId),
			unitId = parseInt(input.params.unitId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([
				getOrganization(organizationId),
				getUnit(organizationId, unitId),
				getUnitChildren(organizationId, unitId)
			]);
		}

		return {
			...response,
			props: {
				organizationId,
				unitId
			}
		};
	}
</script>

<script lang="ts">
	import { getUnit, getUnitChildren, organizationUnits } from '$lib/state/organizationUnits';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Unit from '$lib/UserOrganizations/Units/Unit.svelte';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';
	import { openSidebar } from '$lib/Sidebar.svelte';
	import UnitTree from '$lib/UserOrganizations/UnitTree.svelte';

	export let organizationId: number;
	export let unitId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: unit = $organizationUnits.byId[unitId];
	$: children = Object.values($organizationUnits.childrenById[unitId] || {});

	if (browser) {
		getOrganization(organizationId);
		getUnit(organizationId, unitId);
		getUnitChildren(organizationId, unitId);
		setOrganizationIdAssets(organizationId);
		openSidebar();
	}
</script>

<svelte:head>
	<title>{unit?.name || 'Unit'}</title>
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
		},
		{
			href: `/user/organizations/${organizationId}/units/${unitId}`,
			title: unit?.name || 'Unit'
		}
	]}
>
	<div slot="sidebar">
		{#if unit}
			<UnitTree {organizationId} {unit} {children} />
		{/if}
	</div>
	{#if unit}
		<Unit {organizationId} {unit} {children} />
	{/if}
</OrganizationLayout>
