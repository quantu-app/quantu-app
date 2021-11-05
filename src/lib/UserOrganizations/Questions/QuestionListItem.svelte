<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';
	import { titleCase } from 'title-case';

	export let question: QuestionPrivate;
	export let onUpdate: () => void;
	export let onDelete: () => void;

	$: updatedAt = new Date(question.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			{#if question.index != null}
				<span class="badge bg-primary">{question.index + 1}</span>
			{/if}
			<button
				type="button"
				class="btn btn-link"
				data-bs-toggle="modal"
				data-bs-target="#update-question"
				on:click={onUpdate}>{question.name || 'No Name'}</button
			>
			<h6 class="d-inline">- {titleCase(question.type.replace('_', ' '))}</h6>
		</h4>
		<div class="d-flex">
			<div class="d-inline mt-2">
				Last updated {updatedAt.toLocaleTimeString()}
				{updatedAt.toLocaleDateString()}
			</div>
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
					<slot name="dropdown" {question} {onUpdate} {onDelete}>
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
					</slot>
				</ul>
			</div>
		</div>
	</div>
</div>
