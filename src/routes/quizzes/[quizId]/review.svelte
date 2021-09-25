<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			seed = parseInt(input.page.query.get('seed')),
			questionCount = parseInt(input.page.query.get('questionCount')),
			quizId = parseInt(input.page.params.quizId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuiz(quizId), getQuestionResults(quizId)]);
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
	import { questionResults } from '$lib/state/questionResults';
	import { getQuiz, quizzes } from '$lib/state/quizzes';
	import AppLayout from '$lib/AppLayout.svelte';
	import ReviewQuizQuestions from '$lib/Quizzes/ReviewQuizQuestions.svelte';
	import { XorShiftRng } from '@aicacia/rand';
	import { getQuestionResults } from '$lib/state/questionResults';

	export let quizId: number;
	export let questionCount: number;
	export let seed: number;

	$: rng = XorShiftRng.fromSeed(seed);
	$: quiz = $quizzes.byId[quizId];
	$: allQuestionResults = Object.values($questionResults.byQuizId[quizId] || {});
	$: questionResultList = rng
		.shuffle(allQuestionResults)
		.slice(0, questionCount || allQuestionResults.length);

	if (browser) {
		getQuiz(quizId);
		getQuestionResults(quizId, true);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/quizzes`,
			title: 'Quizzes'
		},
		{
			href: `/quizzes/${quizId}`,
			title: quiz?.name
		}
	]}
>
	{#if quiz}
		<ReviewQuizQuestions {quiz} questionResults={questionResultList} />
	{/if}
</AppLayout>
