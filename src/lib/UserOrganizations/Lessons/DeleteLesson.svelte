<script lang="ts">
	import type { Lesson } from '$lib/api/quantu-app-api';

	export let lesson: Lesson;
	export let onDeleteLesson: () => Promise<void>;

	let deletingLesson = false;

	async function internalOnDeleteLesson() {
		deletingLesson = true;
		try {
			await onDeleteLesson();
		} finally {
			deletingLesson = false;
		}
	}
</script>

<div
	class="modal fade"
	id="delete-lesson"
	tabindex="-1"
	aria-labelledby="delete-lesson-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-lesson-label" class="modal-title">
					Delete {lesson?.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteLesson}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white"
				>
					{#if deletingLesson}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete
				</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
