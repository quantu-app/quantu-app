<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.params.organizationId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getCourses(organizationId), getOrganization(organizationId)]);
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
	import { getCourses, organizationCourses } from '$lib/state/organizationCourses';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Courses from '$lib/UserOrganizations/Courses/Courses.svelte';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';

	export let organizationId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: courses = Object.values($organizationCourses.byOrganizationId[organizationId] || {});

	if (browser) {
		getOrganization(organizationId);
		getCourses(organizationId, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>Courses</title>
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
			href: `/user/organizations/${organizationId}/courses`,
			title: 'Courses'
		}
	]}
>
	<Courses {organizationId} {courses} />
</OrganizationLayout>
