<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';

	export let quiz: Quiz;
	export let onDeleteQuiz: () => Promise<void>;

	let deletingQuiz = false;

	async function internalOnDeleteQuiz() {
		deletingQuiz = true;
		try {
			await onDeleteQuiz();
		} finally {
			deletingQuiz = false;
		}
	}
</script>

<div
	class="modal fade"
	id="delete-quiz"
	tabindex="-1"
	aria-labelledby="delete-quiz-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-quiz-label" class="modal-title">
					Delete {quiz?.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteQuiz}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white"
				>
					{#if deletingQuiz}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete
				</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
