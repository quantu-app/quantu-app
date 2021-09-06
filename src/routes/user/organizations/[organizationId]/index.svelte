<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

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
	import Organization from '$lib/UserOrganizations/Organization.svelte';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';

	export let organizationId: number;

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
