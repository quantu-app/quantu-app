<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';
	import { deleteQuestion, updateQuestion } from '$lib/state/organizationQuestions';
	import DeleteQuestion from './DeleteQuestion.svelte';
	import QuestionListItem from './QuestionListItem.svelte';
	import UpdateQuestion from './UpdateQuestion.svelte';

	export let organizationId: number;
	export let questions: QuestionPrivate[];

	let questionToUpdate: QuestionPrivate;
	let questionToDelete: QuestionPrivate;

	function createOnUpdate(question: QuestionPrivate) {
		return function onUpdate() {
			questionToUpdate = question;
		};
	}
	function createOnDelete(question: QuestionPrivate) {
		return function onDelete() {
			questionToDelete = question;
		};
	}

	async function onUpdateQuestion() {
		if (questionToUpdate) {
			await updateQuestion(organizationId, questionToUpdate.id, {
				name: questionToUpdate.name,
				type: questionToUpdate.type,
				prompt: questionToUpdate.prompt,
				tags: questionToUpdate.tags
			});
			questionToUpdate = undefined;
		}
	}
	async function onDeleteQuestion() {
		if (questionToDelete) {
			await deleteQuestion(organizationId, questionToDelete.id);
			questionToDelete = undefined;
		}
	}

	function sortQuestion(a: QuestionPrivate, b: QuestionPrivate) {
		return a.index - b.index;
	}
</script>

<div class="list-group list-group-flush">
	{#each questions.sort(sortQuestion) as question (question.id)}
		<QuestionListItem
			{question}
			onUpdate={createOnUpdate(question)}
			onDelete={createOnDelete(question)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{question}
				onUpdate={createOnUpdate(question)}
				onDelete={createOnDelete(question)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-question"
						aria-label="Update"
						on:click={createOnUpdate(question)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-question"
						aria-label="Delete"
						on:click={createOnDelete(question)}>Delete</button
					>
				</li>
			</slot>
		</QuestionListItem>
	{/each}
</div>

<UpdateQuestion question={questionToUpdate} {onUpdateQuestion} />
<DeleteQuestion question={questionToDelete} {onDeleteQuestion} />
