<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = await authGuard(input),
			quizId = parseInt(input.page.params.quizId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuiz(quizId), getQuestions(undefined, quizId)]);
		}

		return {
			...response,
			props: {
				quizId
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, questions } from '$lib/state/questions';
	import { getQuiz, quizzes } from '$lib/state/quizzes';
	import AppLayout from '$lib/AppLayout.svelte';
	import Quiz from '$lib/Quizzes/Quiz.svelte';

	export let quizId: number;

	$: quiz = $quizzes.byId[quizId];
	$: questionList = Object.values($questions.byQuizId[quizId] || {});

	if (browser) {
		getQuiz(quizId);
		getQuestions(undefined, quizId);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout>
	{#if quiz}
		<Quiz {quiz} questions={questionList} />
	{/if}
</AppLayout>
