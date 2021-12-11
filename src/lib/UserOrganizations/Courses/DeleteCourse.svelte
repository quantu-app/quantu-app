<script lang="ts">
	import type { Course } from '$lib/api/quantu-app-api';

	export let course: Course;
	export let onDeleteCourse: () => Promise<void>;

	let deletingCourse = false;

	async function internalOnDeleteCourse() {
		deletingCourse = true;
		try {
			await onDeleteCourse();
		} finally {
			deletingCourse = false;
		}
	}
</script>

<div
	class="modal fade"
	id="delete-course"
	tabindex="-1"
	aria-labelledby="delete-course-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-course-label" class="modal-title">
					Delete {course?.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteCourse}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white"
				>
					{#if deletingCourse}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete
				</button>
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
