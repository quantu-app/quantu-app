<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getLessons(organizationId), getOrganization(organizationId)]);
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
	import { getLessons, organizationLessons } from '$lib/state/organizationLessons';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Lessons from '$lib/UserOrganizations/Lessons/Lessons.svelte';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';

	export let organizationId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: lessons = Object.values($organizationLessons.byOrganizationId[organizationId] || {});

	if (browser) {
		getOrganization(organizationId);
		getLessons(organizationId, undefined, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>Lessons</title>
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
			href: `/user/organizations/${organizationId}/lessons`,
			title: 'Lessons'
		}
	]}
>
	<Lessons {organizationId} {lessons} />
</OrganizationLayout>
