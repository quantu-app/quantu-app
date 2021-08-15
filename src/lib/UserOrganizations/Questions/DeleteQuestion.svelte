<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';

	export let question: QuestionPrivate;
	export let onDeleteQuestion: () => Promise<void>;

	let deleteQuestionText = '';

	async function internalOnDeleteQuestion() {
		await onDeleteQuestion();
		deleteQuestionText = '';
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
					Delete {question?.type}
					{question?.id}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteQuestionText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteQuestion}
					disabled={deleteQuestionText.trim().toLowerCase() !== 'delete'}
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
