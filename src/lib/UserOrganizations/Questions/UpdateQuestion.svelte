<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import QuestionEditor from './QuestionEditor.svelte';

	export let question: Question;
	export let onUpdateQuestion: () => Promise<void>;

	async function internalUpdateQuestion() {
		await onUpdateQuestion();
		window.bootstrap.Modal.getInstance('#update-question').hide();
	}
</script>

<div
	class="modal fade"
	id="update-question"
	tabindex="-1"
	aria-labelledby="update-question-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="update-question-label" class="modal-title">Update Question</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if question}
					<QuestionEditor bind:question />
				{/if}
			</div>
			<div class="modal-footer">
				<button type="button" on:click={internalUpdateQuestion} class="btn btn-primary"
					>Update</button
				>
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
