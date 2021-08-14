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
	import Tags from '$lib/Tags.svelte';

	export let organizationId: number;
	export let quiz: Quiz;
	export let questions: Question[];

	function onNameChange() {
		updateQuiz(organizationId, quiz.id, {
			name: quiz.name
		});
	}

	function onTagsChange() {
		updateQuiz(organizationId, quiz.id, {
			tags: quiz.tags
		});
	}

	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;
</script>

<div class="container mb-2">
	<div class="d-flex justify-content-between">
		<div>
			<form on:submit|preventDefault>
				<div class="d-flex">
					<div>
						<label for="quiz-name" class="form-label">Quiz Name</label>
						<input
							id="quiz-name"
							type="text"
							class="form-control"
							placeholder="Enter Name"
							bind:value={quiz.name}
							on:change={onNameChange}
						/>
					</div>
					<div class="flex-grow-1 ms-2">
						<label for="quiz-tags" class="form-label">Quiz Tags</label>
						<Tags id="quiz-tags" bind:tags={quiz.tags} on:change={onTagsChange} />
					</div>
				</div>
			</form>
		</div>
		<div>
			<CreateQuestion {organizationId} quizId={quiz.id} />
		</div>
	</div>
</div>

<div class="container">
	<Search bind:filter={$state.questionNameFilter} />
</div>
<div class="container">
	<QuestionList {organizationId} questions={questions.filter(filter)} />
</div>
