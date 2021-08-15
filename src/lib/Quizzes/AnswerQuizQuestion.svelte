<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';
	import QuestionComponent from '$lib/Questions/Question.svelte';

	export let quiz: Quiz;
	export let question: Question;
	export let questionCount: number;
	export let seed: number;
	export let index: number;

	let answered: boolean;
	let result: number;
	let prevIndex: number;

	$: if (prevIndex !== index) {
		prevIndex = index;
		answered = undefined;
		result = undefined;
	}
</script>

<div class="container mb-2 h-100">
	<h2>
		{quiz.name}
		{#if question.name}
			<h4 class="d-inline">- {question.name}</h4>
		{/if}
	</h2>
	<hr class="mb-0" />
	<QuestionComponent {question} bind:answered bind:result>
		<a
			slot="extra"
			type="button"
			disabled={!answered}
			class="btn btn-primary"
			href={index >= questionCount - 1
				? `/quizzes/${quiz.id}/review?seed=${seed}&questionCount=${questionCount}`
				: `/quizzes/${quiz.id}/answer?index=${
						index + 1
				  }&seed=${seed}&questionCount=${questionCount}`}
		>
			{#if index >= questionCount - 1}
				Finish
			{:else}
				Next
			{/if}
		</a>
	</QuestionComponent>
</div>
