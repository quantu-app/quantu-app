<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			questionId = parseInt(input.params.questionId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuestionResult(questionId), getQuestion(questionId)]);
		}

		return {
			...response,
			props: {
				questionId
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestion, questions } from '$lib/state/questions';
	import { questionResults } from '$lib/state/questionResults';
	import AppLayout from '$lib/AppLayout.svelte';
	import ReviewQuestion from '$lib/Questions/ReviewQuestion.svelte';
	import { getQuestionResult } from '$lib/state/questionResults';

	export let questionId: number;

	$: question = $questions.byId[questionId];
	$: questionResult = $questionResults.byId[questionId];

	if (browser) {
		getQuestion(questionId);
		getQuestionResult(questionId);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/challenges`,
			title: 'Questions'
		},
		{
			href: `/challenges/${questionId}`,
			title: question?.name
		},
		{
			href: `/challenges/${questionId}/review`,
			title: 'Review'
		}
	]}
>
	<div class="container flex-grow-1">
		{#if questionResult}
			<ReviewQuestion result={questionResult}>
				<a slot="extra" role="button" class="btn btn-primary" href={`/challenges/${question?.id}`}>
					Return to {question?.name}
				</a>
			</ReviewQuestion>
		{/if}
	</div>
</AppLayout>
