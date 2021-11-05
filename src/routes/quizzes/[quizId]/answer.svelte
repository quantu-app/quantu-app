<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			seed = parseInt(input.page.query.get('seed')),
			questionCount = parseInt(input.page.query.get('questionCount')),
			index = parseInt(input.page.query.get('index')),
			quizId = parseInt(input.page.params.quizId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuiz(quizId), getQuestions(undefined, quizId)]);
		}

		if (index >= questionCount) {
			return {
				status: 302,
				redirect: `/quizzes/${quizId}/review?seed=${seed}&questionCount=${questionCount}`
			};
		}

		return {
			...response,
			props: {
				quizId,
				questionCount,
				index,
				seed
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, questions } from '$lib/state/questions';
	import { getQuiz, quizzes } from '$lib/state/quizzes';
	import AppLayout from '$lib/AppLayout.svelte';
	import AnswerQuizQuestion from '$lib/Quizzes/AnswerQuizQuestion.svelte';
	import { XorShiftRng } from '@aicacia/rand';

	export let quizId: number;
	export let questionCount: number;
	export let seed: number;
	export let index: number;

	$: rng = XorShiftRng.fromSeed(seed);
	$: quiz = $quizzes.byId[quizId];
	$: questionList = rng
		.shuffle(
			Object.values($questions.byQuizId[quizId] || {}).sort((a, b) =>
				a.updatedAt.localeCompare(b.updatedAt)
			)
		)
		.slice(0, questionCount);
	$: question = questionList[index];

	if (browser) {
		getQuiz(quizId);
		getQuestions(undefined, quizId, true);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout>
	{#if quiz && question}
		<AnswerQuizQuestion {quiz} {question} {questionCount} {seed} {index} />
	{/if}
</AppLayout>
