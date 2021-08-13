<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import { deleteQuestion, updateQuestion } from '$lib/state/organizationQuestions';
	import DeleteQuestion from './DeleteQuestion.svelte';
	import QuestionListItem from './QuestionListItem.svelte';
	import UpdateQuestion from './UpdateQuestion.svelte';

	export let organizationId: number;
	export let questions: Question[];

	let questionToUpdate: Question;
	let questionToDelete: Question;

	function createOnUpdate(question: Question) {
		return function onUpdate() {
			questionToUpdate = question;
		};
	}
	function createOnDelete(question: Question) {
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

	function sortQuestion(a: Question, b: Question) {
		return a.index - b.index;
	}
</script>

<div class="list-group list-group-flush">
	{#each questions.sort(sortQuestion) as question}
		<QuestionListItem
			{question}
			onUpdate={createOnUpdate(question)}
			onDelete={createOnDelete(question)}
		/>
	{/each}
</div>

<UpdateQuestion question={questionToUpdate} {onUpdateQuestion} />
<DeleteQuestion question={questionToDelete} {onDeleteQuestion} />
