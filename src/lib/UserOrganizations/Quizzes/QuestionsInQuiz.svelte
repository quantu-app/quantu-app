<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		questionNameFilter: string | undefined;
	}

	const state = writable<IState>({
		questionNameFilter: undefined
	});

	function reduceQuestions(map: Record<string, QuestionPrivate>, question: QuestionPrivate) {
		map[question.id] = question;
		return map;
	}
</script>

<script lang="ts">
	import type { QuestionPrivate, Quiz } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import {
		getQuestions,
		organizationQuestions,
		removeQuestionsFromQuiz,
		addQuestionsToQuiz
	} from '$lib/state/organizationQuestions';
	import { currentUser } from '$lib/state/user';
	import QuestionsInQuizItem from './QuestionsInQuizItem.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';

	export let organizationId: number;
	export let quiz: Quiz;

	$: questionsByQuizId = $organizationQuestions.byQuizId[quiz.id] || {};
	$: selected = Object.values(questionsByQuizId).reduce(reduceQuestions, {});
	$: unselected = Object.values($organizationQuestions.byOrganizationId[organizationId] || {})
		.filter((question) => !selected[question.id])
		.map((question) => {
			const selectedQuestion = questionsByQuizId[question.id];

			if (selectedQuestion) {
				return selectedQuestion;
			} else {
				return question;
			}
		});

	$: filteredUnselected = Object.values(unselected).filter((question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true
	);

	if ($currentUser) {
		getQuestions(organizationId, undefined, true);
	}

	let addingQuestion = false;

	$: onUpdateQuestionsInQuiz = async () => {
		addingQuestion = true;

		const promises: Promise<void>[] = [],
			questionsToAdd = Object.values(selected)
				.filter((question) => !question.quizId)
				.map((question) => question.id),
			questionsToRemove = Object.values(unselected)
				.filter((question) => !!question.quizId)
				.map((question) => question.id);

		if (questionsToAdd.length) {
			promises.push(addQuestionsToQuiz(organizationId, quiz.id, questionsToAdd));
		}
		if (questionsToRemove.length) {
			promises.push(removeQuestionsFromQuiz(organizationId, quiz.id, questionsToRemove));
		}

		try {
			await Promise.all(promises);
		} finally {
			addingQuestion = false;
		}
		window.bootstrap.Modal.getInstance('#update-questions-in-quiz').hide();
	};

	$: onSelect = (question: QuestionPrivate) => {
		selected = { ...selected, [question.id]: question };
	};
	$: onUnselect = (question: QuestionPrivate) => {
		const newSelected = { ...selected };
		delete newSelected[question.id];
		selected = newSelected;
	};
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#update-questions-in-quiz"
	aria-label="Add Question">Update Questions in Quiz</button
>

<div
	class="modal fade"
	id="update-questions-in-quiz"
	tabindex="-1"
	aria-labelledby="update-questions-in-quiz-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="update-questions-in-quiz-label" class="modal-title">
					Add Questions to Quiz {quiz.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="accordion accordion-flush" id="question-quiz-list">
					{#each Object.values(selected) as question}
						<QuestionsInQuizItem {question} onClick={onUnselect}
							><i class="bi bi-dash" /></QuestionsInQuizItem
						>
					{/each}
				</div>
				<hr />
				<Search bind:filter={$state.questionNameFilter} />
				<ul class="list-group list-group-flush">
					{#each filteredUnselected as question}
						<li class="list-group-item">
							<QuestionsInQuizItem {question} onClick={onSelect}
								><i class="bi bi-plus" /></QuestionsInQuizItem
							>
						</li>
					{/each}
				</ul>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onUpdateQuestionsInQuiz}
					disabled={addingQuestion}
					class="btn btn-primary"
				>
					{#if addingQuestion}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Update
				</button>
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
