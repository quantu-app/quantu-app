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
	import type { QuestionPrivate, Quiz } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import { getQuestions, organizationQuestions } from '$lib/state/organizationQuestions';
	import { currentUser } from '$lib/state/user';
	import AddQuestionToQuizItem from './AddQuestionToQuizItem.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';

	export let organizationId: number;
	export let quiz: Quiz;

	let addingQuestion = false;
	$: questions = Object.values(
		$organizationQuestions.byOrganizationId[organizationId] || {}
	).filter((question) => question.quizId !== quiz.id);
	let prevQuestions: QuestionPrivate[] = [];

	let unselected: Record<string, QuestionPrivate> = {};
	let selected: Record<string, QuestionPrivate> = {};
	$: filteredSelected = Object.values(unselected).filter((question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true
	);

	$: if (prevQuestions.length !== questions.length) {
		prevQuestions = questions;
		unselected = questions.reduce((acc, question) => ({ ...acc, [question.id]: question }), {});
		selected = {};
	}

	if ($currentUser) {
		getQuestions(organizationId);
	}

	async function onAddQuestionsToQuiz() {
		addingQuestion = true;
		try {
			// TODO: add questions to quiz via api
		} finally {
			addingQuestion = false;
		}
		window.bootstrap.Modal.getInstance('#add-question-to-quiz').hide();
	}

	$: onSelect = (question: QuestionPrivate) => {
		selected = { ...selected, [question.id]: question };
		const newUnselected = { ...unselected };
		delete newUnselected[question.id];
		unselected = newUnselected;
	};
	$: onUnselect = (question: QuestionPrivate) => {
		unselected = { ...unselected, [question.id]: question };
		const newSelected = { ...selected };
		delete newSelected[question.id];
		selected = newSelected;
	};
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#add-question-to-quiz"
	aria-label="Add Question">Add Questions to Quiz</button
>

<div
	class="modal fade"
	id="add-question-to-quiz"
	tabindex="-1"
	data-bs-keyboard="false"
	aria-labelledby="add-question-to-quiz-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="add-question-to-quiz-label" class="modal-title">
					Add Questions to Quiz {quiz.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<ul class="list-group list-group-flush">
					{#each Object.values(selected) as question}
						<li class="list-group-item">
							<AddQuestionToQuizItem
								{question}
								checked={true}
								onCheck={() => onUnselect(question)}
							/>
						</li>
					{/each}
				</ul>
				<hr />
				<Search bind:filter={$state.questionNameFilter} />
				<ul class="list-group list-group-flush">
					{#each filteredSelected as question}
						<li class="list-group-item">
							<AddQuestionToQuizItem
								{question}
								checked={false}
								onCheck={() => onSelect(question)}
							/>
						</li>
					{/each}
				</ul>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onAddQuestionsToQuiz}
					disabled={addingQuestion}
					class="btn btn-primary"
				>
					{#if addingQuestion}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Add
				</button>
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
