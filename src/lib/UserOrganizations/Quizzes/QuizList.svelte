<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import { deleteQuiz } from '$lib/state/organizationQuizzes';
	import DeleteQuiz from './DeleteQuiz.svelte';
	import QuizListItem from './QuizListItem.svelte';

	export let organizationId: number;
	export let quizzes: Quiz[];

	let quizToDelete: Quiz;

	function createOnDelete(quiz: Quiz) {
		return function onDelete() {
			quizToDelete = quiz;
		};
	}

	function onDeleteQuiz() {
		if (quizToDelete) {
			deleteQuiz(organizationId, quizToDelete.id);
			quizToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each quizzes as quiz (quiz.id)}
		<QuizListItem {quiz} onDelete={createOnDelete(quiz)} />
	{/each}
</div>

<DeleteQuiz {quizToDelete} {onDeleteQuiz} />
