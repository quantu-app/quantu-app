<script lang="ts">
	import type { QuestionCreate } from '$lib/api/quantu-app-api';
	import { createQuestion } from '$lib/state/organizationQuestions';
	import QuestionEditor from './QuestionEditor.svelte';

	export let organizationId: number;
	export let quizId: number | null;

	let prevQuizId: number;

	let question: QuestionCreate = {
		quizId,
		prompt: {},
		tags: []
	};

	$: if (prevQuizId !== quizId) {
		prevQuizId = quizId;
		question.quizId = quizId;
	}

	async function onCreateQuestion() {
		await createQuestion(organizationId, question);
		window.bootstrap.Modal.getInstance('#create-question');
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
				<button type="button" on:click={onCreateQuestion} class="btn btn-primary">Create</button>
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
