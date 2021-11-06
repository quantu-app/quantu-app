<script context="module" lang="ts">
	interface IQuizConfig {
		seed: number;
		questionCount: number;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Quiz, Question } from '$lib/api/quantu-app-api';
	import { randomString } from '$lib/utils';

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
	$: onPlay = () => {
		goto(
			`/quizzes/${quiz.id}/play/${randomString()}?index=0&seed=${quizConfig.seed}&questionCount=${
				quizConfig.questionCount
			}`
		);
	};
</script>

<div class="container mb-2">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
	<hr />
</div>
<div class="container mb-2">
	<div class="col-lg-4 col-md-6 mx-auto">
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
			<button role="button" class="btn btn-success me-2" on:click={onPlay}>Play</button>
			<a
				role="button"
				class="btn btn-primary"
				href={`/quizzes/${quiz.id}/answer?index=0&seed=${quizConfig.seed}&questionCount=${quizConfig.questionCount}`}
				>Pratice</a
			>
		</div>
	</div>
</div>
