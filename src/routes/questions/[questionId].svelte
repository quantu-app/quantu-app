<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			questionId = parseInt(input.page.params.questionId);

		if (!browser && isValidStatus(response)) {
			await getQuestion(questionId);
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
	import { questions } from '$lib/state/questions';
	import AppLayout from '$lib/AppLayout.svelte';
	import { getQuestion } from '$lib/state/questions';
	import Question from '$lib/Questions/Question.svelte';

	export let questionId: number;

	$: question = $questions.byId[questionId];

	if (browser) {
		getQuestion(questionId);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout>
	<div class="container h-100">
		{#if question}
			<Question {question}>
				<a slot="extra" type="button" class="btn btn-primary" href="/questions">
					Return to questions
				</a>
			</Question>
		{/if}
	</div>
</AppLayout>
