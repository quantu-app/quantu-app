<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';

	export let quizToDelete: Quiz;
	export let onDeleteQuiz: () => void;

	let deleteQuizText = '';

	function internalOnDeleteQuiz() {
		deleteQuizText = '';
		onDeleteQuiz();
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
					Delete {quizToDelete?.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteQuizText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteQuiz}
					disabled={deleteQuizText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
