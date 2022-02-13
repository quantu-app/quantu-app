<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.params.organizationId),
			unitId = parseInt(input.params.unitId),
			lessonId = parseInt(input.params.lessonId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getOrganization(organizationId), getLesson(organizationId, lessonId)]);
		}

		return {
			...response,
			props: {
				organizationId,
				unitId,
				lessonId
			}
		};
	}
</script>

<script lang="ts">
	import { getLesson, organizationLessons } from '$lib/state/organizationLessons';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/components/UserOrganizations/OrganizationLayout.svelte';
	import Lesson from '$lib/components/UserOrganizations/Lessons/Lesson.svelte';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';
	import { organizationCourses } from '$lib/state/organizationCourses';
	import { organizationUnits } from '$lib/state/organizationUnits';

	export let organizationId: number;
	export let unitId: number;
	export let lessonId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: unit = $organizationUnits.byId[unitId];
	$: lesson = $organizationLessons.byId[lessonId];

	if (browser) {
		getOrganization(organizationId);
		getLesson(organizationId, lessonId);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>{lesson?.name || 'Lesson'}</title>
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
		},
		{
			title: 'Lessons'
		},
		{
			href: `/user/organizations/${organizationId}/units/${unitId}/lessons/${lesson?.id}`,
			title: lesson?.name || 'Lesson'
		}
	]}
>
	{#if lesson}
		<Lesson {organizationId} {unitId} {lesson} />
	{/if}
</OrganizationLayout>
