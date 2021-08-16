<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = await authGuard(input),
			seed = parseInt(input.page.query.get('seed')),
			questionCount = parseInt(input.page.query.get('questionCount')),
			quizId = parseInt(input.page.params.quizId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuiz(quizId), getQuestions(undefined, quizId)]);
		}

		return {
			...response,
			props: {
				quizId,
				questionCount,
				seed
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, questions } from '$lib/state/questions';
	import { getQuiz, quizzes } from '$lib/state/quizzes';
	import AppLayout from '$lib/AppLayout.svelte';
	import ReviewQuizQuestion from '$lib/Quizzes/ReviewQuizQuestion.svelte';
	import { createRandom } from '$lib/utils';

	export let quizId: number;
	export let questionCount: number;
	export let seed: number;

	$: rng = createRandom(seed);
	$: quiz = $quizzes.byId[quizId];
	$: questionList = shuffle(rng, Object.values($questions.byQuizId[quizId] || {})).slice(
		0,
		questionCount
	);

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
		<ReviewQuizQuestion {quiz} questions={questionList} {questionCount} {seed} />
	{/if}
</AppLayout>
