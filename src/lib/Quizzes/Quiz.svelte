<script context="module" lang="ts">
	interface IQuizConfig {
		seed: number;
		questionCount: number;
	}
</script>

<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';

	export let quiz: Quiz;
	export let questions: Question[];

	let lastQuestions: Question[];

	let quizConfig: IQuizConfig = {
		seed: Date.now(),
		questionCount: questions.length
	};

	$: if (lastQuestions !== questions) {
		lastQuestions = questions;
		quizConfig.questionCount = questions.length;
	}
</script>

<div class="container mb-2">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
	<hr />
	<div class="row">
		<div class="col-md">
			<label for="question-count" class="form-label">Number of Questions</label>
			<input
				id="question-count"
				type="number"
				class="form-control"
				placeholder="Question Name"
				min={1}
				max={questions.length}
				bind:value={quizConfig.questionCount}
			/>
		</div>
	</div>
	<div class="d-flex justify-content-end mt-2">
		<a role="button" class="btn btn-secondary me-2" href={`/quizzes/${quiz.id}/review`}>Review</a>
		<a
			role="button"
			class="btn btn-primary"
			href={`/quizzes/${quiz.id}/answer?index=0&seed=${quizConfig.seed}&questionCount=${quizConfig.questionCount}`}
			>Start</a
		>
	</div>
</div>
