<script lang="ts">
	import type { QuestionCreate, QuestionPromptPrivate } from '$lib/api/quantu-app-api';
	import { createQuestion } from '$lib/state/organizationQuestions';
	import QuestionEditor from './QuestionEditor.svelte';

	export let organizationId: number;
	export let quizId: number | null;

	let prevQuizId: number;
	let creatingQuestion = false;

	let question: QuestionCreate = {
		quizId,
		type: 'multiple_choice' as QuestionCreate.type.MULTIPLE_CHOICE,
		prompt: {} as unknown as QuestionPromptPrivate,
		tags: []
	};

	$: if (prevQuizId !== quizId) {
		prevQuizId = quizId;
		question.quizId = quizId;
	}

	async function onCreateQuestion() {
		creatingQuestion = true;
		try {
			await createQuestion(organizationId, question);
			delete question.name;
			question.prompt = {} as unknown as QuestionPromptPrivate;
			question.tags = [];
		} finally {
			creatingQuestion = false;
		}
		window.bootstrap.Modal.getInstance('#create-question').hide();
	}
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-question"
	aria-label="Create Question">Create Question</button
>

<div
	class="modal fade"
	id="create-question"
	tabindex="-1"
	data-bs-keyboard="false"
	aria-labelledby="create-question-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-question-label" class="modal-title">Create Question</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<QuestionEditor bind:question />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateQuestion}
					disabled={creatingQuestion}
					class="btn btn-primary"
				>
					{#if creatingQuestion}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Create
				</button>
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
