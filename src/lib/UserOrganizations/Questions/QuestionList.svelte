<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';
	import { deleteQuestion, updateQuestion } from '$lib/state/organizationQuestions';
	import DeleteQuestion from './DeleteQuestion.svelte';
	import QuestionListItem from './QuestionListItem.svelte';
	import UpdateQuestion from './UpdateQuestion.svelte';

	export let organizationId: number;
	export let quizId: number = undefined;
	export let questions: QuestionPrivate[];

	let question: QuestionPrivate;
	let questionIndex: number;

	function createOnUpdate(q: QuestionPrivate, index: number) {
		return function onUpdate() {
			question = q;
			questionIndex = index;
		};
	}
	function createOnDelete(q: QuestionPrivate, index: number) {
		return function onDelete() {
			question = q;
			questionIndex = index;
		};
	}

	async function onUpdateQuestion() {
		if (question) {
			await updateQuestion(organizationId, question.id, {
				quizId,
				index: questionIndex,
				name: question.name,
				type: question.type,
				prompt: question.prompt,
				tags: question.tags
			});
			question = undefined;
			questionIndex = undefined;
		}
	}
	async function onDeleteQuestion() {
		if (question) {
			await deleteQuestion(organizationId, question.id);
			question = undefined;
			questionIndex = undefined;
		}
	}

	function sortQuestion(a: QuestionPrivate, b: QuestionPrivate) {
		return a.index - b.index;
	}
</script>

<div class="list-group list-group-flush">
	{#each questions.sort(sortQuestion) as question, index (question.id)}
		<QuestionListItem
			{question}
			{index}
			onUpdate={createOnUpdate(question, index)}
			onDelete={createOnDelete(question, index)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{question}
				onUpdate={createOnUpdate(question, index)}
				onDelete={createOnDelete(question, index)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-question"
						aria-label="Update"
						on:click={createOnUpdate(question, index)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-question"
						aria-label="Delete"
						on:click={createOnDelete(question, index)}>Delete</button
					>
				</li>
			</slot>
		</QuestionListItem>
	{/each}
</div>

<UpdateQuestion {question} {onUpdateQuestion} />
<DeleteQuestion {question} {onDeleteQuestion} />
