<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';
	import type { Quiz } from '$lib/api/quantu-app-api';
	import FlashCardReview from '$lib/Questions/FlashCardReview.svelte';
	import MultipleChoiceReview from '$lib/Questions/MultipleChoiceReview.svelte';

	export let quiz: Quiz;
	export let questionResults: QuestionResult[] = [];

	$: percent =
		questionResults.reduce((count, questionResult) => count + questionResult.result, 0) /
		questionResults.length;
</script>

<div class="container mb-2">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
	<hr />
	<h3>Percent {percent * 100}%</h3>
	<ul class="list-group list-group-flush">
		{#each questionResults as questionResult}
			<li class="list-group-item">
				{#if questionResult.type === 'multiple_choice'}
					<MultipleChoiceReview result={questionResult} />
				{:else if questionResult.type === 'flash_card'}
					<FlashCardReview result={questionResult} />
				{/if}
			</li>
		{/each}
	</ul>
	<div class="d-flex justify-content-end mt-2">
		<a type="button" class="btn btn-primary" href={`/quizzes/${quiz.id}`}>Retake</a>
	</div>
</div>
