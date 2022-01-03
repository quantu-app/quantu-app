<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';
	import { titleCase } from 'title-case';

	export let question: QuestionPrivate;
	export let onDeleteQuestion: () => Promise<void>;

	let deletingQuestion = false;

	async function internalOnDeleteQuestion() {
		deletingQuestion = true;
		try {
			await onDeleteQuestion();
		} finally {
			deletingQuestion = false;
		}
		window.bootstrap.Modal.getInstance('#delete-question').hide();
	}
</script>

<div
	class="modal fade"
	id="delete-question"
	tabindex="-1"
	aria-labelledby="delete-question-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-question-label" class="modal-title">
					Delete {question?.name} - {question ? titleCase(question.type.replace('_', ' ')) : ''}
					{question?.id}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button type="button" on:click={internalOnDeleteQuestion} class="btn btn-danger text-white">
					{#if deletingQuestion}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete</button
				>
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
