<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';
	import { updateQuiz } from '$lib/state/organizationQuizzes';
	import CreateQuestion from '../Questions/CreateQuestion.svelte';
	import QuestionList from '../Questions/QuestionList.svelte';

	export let organizationId: number;
	export let quiz: Quiz;
	export let questions: Question[];

	let name = quiz.name;

	async function onChange() {
		await updateQuiz(organizationId, quiz.id, {
			name
		});
	}
</script>

<div class="container">
	<form on:submit|preventDefault>
		<div class="input-group">
			<label for="quiz-name" class="input-group-text">Name</label>
			<input
				id="quiz-name"
				type="text"
				class="form-control"
				placeholder="Enter Name"
				bind:value={name}
				on:change={onChange}
			/>
		</div>
	</form>
	<CreateQuestion {organizationId} quizId={quiz.id} />
	<QuestionList {organizationId} {questions} />
</div>
