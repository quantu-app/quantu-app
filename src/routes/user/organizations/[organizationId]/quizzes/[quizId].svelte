<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId),
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
				quizId
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, organizationQuestions } from '$lib/state/organizationQuestions';
	import { getQuiz, organizationQuizzes } from '$lib/state/organizationQuizzes';
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quiz from '$lib/UserOrganizations/Quizzes/Quiz.svelte';

	export let organizationId: number;
	export let quizId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: quiz = $organizationQuizzes.byId[quizId];
	$: questions = Object.values($organizationQuestions.byQuizId[quizId] || {});

	if (browser) {
		getOrganization(organizationId);
		getQuiz(organizationId, quizId);
		getQuestions(organizationId, quizId, true);
	}
</script>

<svelte:head>
	<title>Quiz</title>
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
			href: `/user/organizations/${organizationId}/quizzes`,
			title: 'Quizzes'
		},
		{
			href: `/user/organizations/${organizationId}/quizzes/${quizId}`,
			title: quiz?.name || 'Quiz'
		}
	]}
>
	{#if quiz}
		<Quiz {organizationId} {quiz} {questions} />
	{/if}
</OrganizationLayout>
