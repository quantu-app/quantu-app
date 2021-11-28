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
			quizId = parseInt(input.page.params.quizId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([
				getOrganization(organizationId),
				getQuiz(organizationId, quizId),
				getQuestions(organizationId, quizId)
			]);
		}

		return {
			...response,
			props: {
				organizationId,
				courseId,
				unitId,
				quizId
			}
		};
	}
</script>

<script lang="ts">
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quiz from '$lib/UserOrganizations/Quizzes/Quiz.svelte';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';
	import { getCourse, organizationCourses } from '$lib/state/organizationCourses';
	import { getUnits, organizationUnits } from '$lib/state/organizationUnits';
	import { getQuiz, organizationQuizzes } from '$lib/state/organizationQuizzes';
	import { getQuestions, organizationQuestions } from '$lib/state/organizationQuestions';
	import CourseTree from '$lib/UserOrganizations/CourseTree.svelte';

	export let organizationId: number;
	export let courseId: number;
	export let unitId: number;
	export let quizId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: course = $organizationCourses.byId[courseId];
	$: units = Object.values($organizationUnits.byCourseId[courseId] || {});
	$: unit = $organizationUnits.byId[unitId];
	$: quiz = $organizationQuizzes.byId[quizId];
	$: questions = Object.values($organizationQuestions.byQuizId[quizId] || {});

	if (browser) {
		getOrganization(organizationId);
		getCourse(organizationId, courseId);
		getUnits(organizationId, courseId);
		getQuiz(organizationId, quizId);
		getQuestions(organizationId, quizId, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>{quiz?.name || 'Quiz'}</title>
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
			title: 'Quizs'
		},
		{
			href: `/user/organizations/${organizationId}/courses/${courseId}/units/${unitId}/quizzes/${quiz?.id}`,
			title: quiz?.name || 'Quiz'
		}
	]}
>
	<div slot="sidebar">
		{#if course}
			<CourseTree {organizationId} {course} {units} />
		{/if}
	</div>
	{#if quiz}
		<Quiz {organizationId} {courseId} {unitId} {quiz} {questions} />
	{/if}
</OrganizationLayout>
