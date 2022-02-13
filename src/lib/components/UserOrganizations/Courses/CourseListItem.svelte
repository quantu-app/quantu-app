<script lang="ts">
	import type { Course } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/components/RichEditor.svelte';
	import RichViewer from '$lib/components/RichViewer.svelte';

	export let course: Course;
	export let onDelete: () => void;

	$: updatedAt = new Date(course.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<div class="d-flex flex-column align-items-start">
			<h4>
				<a
					aria-label="Edit"
					href={`/user/organizations/${course.organizationId}/courses/${course.id}`}
					>{course.name}</a
				>
			</h4>
			<div>
				{#each course.tags as tag}
					<span class="badge bg-primary me-2">{tag}</span>
				{/each}
			</div>
		</div>
		<div class="d-flex flex-column align-items-end">
			<div class="dropdown">
				<button
					id={`course-dropdown-${course.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul
					class="dropdown-menu dropdown-menu-end"
					aria-labelledby={`course-dropdown-${course.id}`}
				>
					<li>
						<a
							class="dropdown-item justify-content-between"
							href={`/user/organizations/${course.organizationId}/courses/${course.id}`}>Edit</a
						>
					</li>
					<li>
						<button
							type="button"
							class="dropdown-item justify-content-between"
							data-bs-toggle="modal"
							data-bs-target="#delete-course"
							aria-label="Delete"
							on:click={onDelete}>Delete</button
						>
					</li>
				</ul>
			</div>
			<div class="d-inline mt-2">
				Last updated {updatedAt.toLocaleTimeString()}
				{updatedAt.toLocaleDateString()}
			</div>
		</div>
	</div>
</div>
