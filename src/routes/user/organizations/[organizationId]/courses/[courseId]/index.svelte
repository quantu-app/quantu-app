<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId),
			courseId = parseInt(input.page.params.courseId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([
				getOrganization(organizationId),
				getCourse(organizationId, courseId),
				getUnits(organizationId, courseId)
			]);
		}

		return {
			...response,
			props: {
				organizationId,
				courseId
			}
		};
	}
</script>

<script lang="ts">
	import { getCourse, organizationCourses } from '$lib/state/organizationCourses';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Course from '$lib/UserOrganizations/Courses/Course.svelte';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';
	import { getUnits, organizationUnits } from '$lib/state/organizationUnits';
	import CourseTree from '$lib/UserOrganizations/CourseTree.svelte';

	export let organizationId: number;
	export let courseId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: course = $organizationCourses.byId[courseId];
	$: units = Object.values($organizationUnits.byCourseId[courseId] || {});

	if (browser) {
		getOrganization(organizationId);
		getCourse(organizationId, courseId);
		getUnits(organizationId, courseId, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>{course?.name || 'Course'}</title>
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
		},
		{
			href: `/user/organizations/${organizationId}/courses/${courseId}`,
			title: course?.name || 'Course'
		}
	]}
>
	<div slot="sidebar">
		{#if course}
			<CourseTree {organizationId} {course} {units} />
		{/if}
	</div>
	{#if course}
		<Course {organizationId} {course} {units} />
	{/if}
</OrganizationLayout>
