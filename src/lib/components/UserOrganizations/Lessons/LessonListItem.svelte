<script lang="ts">
	import type { Lesson } from '$lib/api/quantu-app-api';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number = undefined;
	export let courseId: number = undefined;
	export let unitId: number = undefined;
	export let lesson: Lesson;
	export let onDelete: () => void;

	$: updatedAt = new Date(lesson.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a
				aria-label="Edit"
				href={organizationPath(organizationId, courseId, unitId, lesson.id, lesson.type)}
				>{lesson.name}</a
			>
		</h4>
		<div class="d-flex">
			<div class="d-inline mt-2">
				Last updated {updatedAt.toLocaleTimeString()}
				{updatedAt.toLocaleDateString()}
			</div>
			<div class="dropdown">
				<button
					id={`lesson-dropdown-${lesson.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul
					class="dropdown-menu dropdown-menu-end"
					aria-labelledby={`lesson-dropdown-${lesson.id}`}
				>
					<li>
						<a
							class="dropdown-item justify-content-between"
							href={organizationPath(organizationId, courseId, unitId, lesson.id, lesson.type)}
							>Edit</a
						>
					</li>
					<li>
						<button
							type="button"
							class="dropdown-item justify-content-between"
							data-bs-toggle="modal"
							data-bs-target="#delete-lesson"
							aria-label="Delete"
							on:click={onDelete}>Delete</button
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
