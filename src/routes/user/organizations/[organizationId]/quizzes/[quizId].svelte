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
			await Promise.all([getQuiz(organizationId, quizId), getQuestions(organizationId, quizId)]);
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
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quiz from '$lib/UserOrganizations/Quizzes/Quiz.svelte';

	export let organizationId: number;
	export let quizId: number;

	$: quiz = $organizationQuizzes.byId[quizId];
	$: questions = Object.values($organizationQuestions.byQuizId[quizId] || {});

	if (browser) {
		getQuiz(organizationId, quizId);
		getQuestions(organizationId, quizId);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	{#if quiz}
		<Quiz {organizationId} {quiz} {questions} />
	{/if}
</OrganizationLayout>
