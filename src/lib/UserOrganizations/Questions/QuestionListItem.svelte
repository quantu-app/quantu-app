<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';

	export let question: Question;
	export let onUpdate: () => void;
	export let onDelete: () => void;

	$: updatedAt = new Date(question.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			{question.type}
		</h4>
		<div class="dropdown">
			<button
				id={`question-dropdown-${question.id}`}
				class="btn btn-ghost dropdown-toggle"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				<i class="bi bi-three-dots-vertical" />
			</button>
			<ul
				class="dropdown-menu dropdown-menu-end"
				aria-labelledby={`question-dropdown-${question.id}`}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-question"
						aria-label="Update"
						on:click={onUpdate}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-question"
						aria-label="Delete"
						on:click={onDelete}>Delete</button
					>
				</li>
			</ul>
		</div>
	</div>
	<div class="d-flex justify-content-between align-items-start">
		<div class="d-inline">
			Last updated {updatedAt.toLocaleTimeString()}
			{updatedAt.toLocaleDateString()}
		</div>
	</div>
</div>
