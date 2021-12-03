<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';
	import type { Quiz } from '$lib/api/quantu-app-api';
	import FlashCardReview from '$lib/Questions/FlashCardReview.svelte';
	import InputReview from '$lib/Questions/InputReview.svelte';
	import MarkAsReadReview from '$lib/Questions/MarkAsReadReview.svelte';
	import MultipleChoiceReview from '$lib/Questions/MultipleChoiceReview.svelte';
	import { toPercent } from '$lib/utils';

	export let quiz: Quiz;
	export let questionResults: QuestionResult[] = [];

	$: percent =
		questionResults.reduce((count, questionResult) => count + questionResult.result, 0) /
		questionResults.length;
</script>

<div class="container">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
	<hr />
	{#if questionResults.length === 0}
		<p>You have not taken this quiz yet.</p>
		<div class="d-flex justify-content-end mt-2">
			<a role="button" class="btn btn-primary" href={`/quizzes/${quiz.id}`}>Take</a>
		</div>
	{:else}
		<h3>Percent {toPercent(percent)}</h3>
		<ul class="list-group list-group-flush">
			{#each questionResults as questionResult}
				<li class="list-group-item">
					{#if questionResult.type === 'multiple_choice'}
						<MultipleChoiceReview result={questionResult} />
					{:else if questionResult.type === 'flash_card'}
						<FlashCardReview result={questionResult} />
					{:else if questionResult.type === 'input'}
						<InputReview result={questionResult} />
					{:else if questionResult.type === 'mark_as_read'}
						<MarkAsReadReview result={questionResult} />
					{/if}
				</li>
			{/each}
		</ul>
		<div class="d-flex justify-content-end mt-2">
			<a role="button" class="btn btn-primary" href={`/quizzes/${quiz.id}`}>Retake</a>
		</div>
	{/if}
</div>
