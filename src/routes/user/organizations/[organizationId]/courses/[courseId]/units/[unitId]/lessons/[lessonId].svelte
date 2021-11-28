<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId),
			courseId = parseInt(input.page.params.courseId),
			unitId = parseInt(input.page.params.unitId),
			lessonId = parseInt(input.page.params.lessonId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getOrganization(organizationId), getLesson(organizationId, lessonId)]);
		}

		return {
			...response,
			props: {
				organizationId,
				courseId,
				unitId,
				lessonId
			}
		};
	}
</script>

<script lang="ts">
	import { getLesson, organizationLessons } from '$lib/state/organizationLessons';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Lesson from '$lib/UserOrganizations/Lessons/Lesson.svelte';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';
	import { getCourse, organizationCourses } from '$lib/state/organizationCourses';
	import { getUnits, organizationUnits } from '$lib/state/organizationUnits';
	import CourseTree from '$lib/UserOrganizations/CourseTree.svelte';

	export let organizationId: number;
	export let courseId: number;
	export let unitId: number;
	export let lessonId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: course = $organizationCourses.byId[courseId];
	$: units = Object.values($organizationUnits.byCourseId[courseId] || {});
	$: unit = $organizationUnits.byId[unitId];
	$: lesson = $organizationLessons.byId[lessonId];

	if (browser) {
		getOrganization(organizationId);
		getCourse(organizationId, courseId);
		getUnits(organizationId, courseId);
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
			href: `/user/organizations/${organizationId}/courses`,
			title: 'Courses'
		},
		{
			href: `/user/organizations/${organizationId}/courses/${courseId}`,
			title: course?.name || 'Course'
		},
		{
			title: 'Units'
		},
		{
			href: `/user/organizations/${organizationId}/courses/${courseId}/units/${unitId}`,
			title: unit?.name || 'Unit'
		},
		{
			title: 'Lessons'
		},
		{
			href: `/user/organizations/${organizationId}/courses/${courseId}/units/${unitId}/lessons/${lesson?.id}`,
			title: lesson?.name || 'Lesson'
		}
	]}
>
	<div slot="sidebar">
		{#if course}
			<CourseTree {organizationId} {course} {units} />
		{/if}
	</div>
	{#if lesson}
		<Lesson {organizationId} {courseId} {unitId} {lesson} />
	{/if}
</OrganizationLayout>
