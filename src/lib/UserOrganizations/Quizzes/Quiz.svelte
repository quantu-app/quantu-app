<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		questionNameFilter: string | undefined;
	}

	const state = writable<IState>({
		questionNameFilter: undefined
	});
</script>

<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import { updateQuiz } from '$lib/state/organizationQuizzes';
	import CreateQuestion from '../Questions/CreateQuestion.svelte';
	import QuestionList from '../Questions/QuestionList.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';

	export let organizationId: number;
	export let quiz: Quiz;
	export let questions: Question[];

	let name = quiz.name;

	async function onChange() {
		await updateQuiz(organizationId, quiz.id, {
			name
		});
	}

	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;
</script>

<div class="container">
	<div class="row">
		<div class="col">
			<form on:submit|preventDefault>
				<div>
					<label for="quiz-name" class="form-label">Quiz Name</label>
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
		</div>
		<div class="col">
			<div class="d-flex justify-content-end">
				<CreateQuestion {organizationId} quizId={quiz.id} />
			</div>
		</div>
	</div>
</div>

<div class="container">
	<Search bind:filter={$state.questionNameFilter} />
</div>
<div class="container">
	<QuestionList {organizationId} questions={questions.filter(filter)} />
</div>
