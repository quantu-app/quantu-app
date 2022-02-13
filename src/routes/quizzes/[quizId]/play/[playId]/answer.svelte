<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			seed = parseInt(input.url.searchParams.get('seed')),
			questionCount = parseInt(input.url.searchParams.get('questionCount')),
			index = parseInt(input.url.searchParams.get('index')),
			playId = input.url.searchParams.playId,
			quizId = parseInt(input.params.quizId);

		if (index >= questionCount) {
			return {
				status: 302,
				redirect: `/quizzes/${quizId}/review?seed=${seed}&questionCount=${questionCount}`
			};
		}

		return {
			...response,
			props: {
				playId,
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
	import AppLayout from '$lib/components/AppLayout.svelte';
	import PlayAnswerQuizQuestion from '$lib/components/Quizzes/PlayAnswerQuizQuestion.svelte';
	import { XorShiftRng } from '@aicacia/rand';
	import { sortById } from '$lib/utils';

	export let quizId: number;
	export let playId: string;
	export let questionCount: number;
	export let seed: number;
	export let index: number;

	$: quiz = $quizzes.byId[quizId];
	$: allQuestions = Object.values($questions.byQuizId[quizId] || {}).sort(sortById);
	$: questionList = XorShiftRng.fromSeed(seed).shuffle(allQuestions).slice(0, questionCount);
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
		<PlayAnswerQuizQuestion
			{playId}
			{quiz}
			{question}
			{questionCount}
			{questionList}
			{seed}
			{index}
		/>
	{/if}
</AppLayout>
