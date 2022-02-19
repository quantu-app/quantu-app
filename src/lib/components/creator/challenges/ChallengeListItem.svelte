<script lang="ts">
	import type { Challenge } from '@prisma/client';
	import { titleCase } from 'title-case';

	export let challenge: Challenge;
	export let quizId: number = undefined;
	export let index: number = undefined;
	export let onUpdate: () => void;
	export let onDelete: () => void;

	$: updatedAt = new Date(challenge.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			{#if quizId != null && index != null}
				<span class="badge bg-primary">{index + 1}</span>
			{/if}
			<button
				type="button"
				class="btn btn-link"
				data-bs-toggle="modal"
				data-bs-target="#update-challenge"
				on:click={onUpdate}>{challenge.name || 'No Name'}</button
			>
			<h6 class="d-inline">
				- {titleCase(challenge.type.replace(/\_/gim, ' '))}
			</h6>
		</h4>
		<div class="d-flex">
			<div class="d-inline mt-2">
				Last updated {updatedAt.toLocaleTimeString()}
				{updatedAt.toLocaleDateString()}
			</div>
			<div class="dropdown">
				<button
					id={`challenge-dropdown-${challenge.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul
					class="dropdown-menu dropdown-menu-end"
					aria-labelledby={`challenge-dropdown-${challenge.id}`}
				>
					<slot name="dropdown" {challenge} {onUpdate} {onDelete}>
						<li>
							<button
								type="button"
								class="dropdown-item justify-content-between"
								data-bs-toggle="modal"
								data-bs-target="#update-challenge"
								aria-label="Update"
								on:click={onUpdate}>Update</button
							>
						</li>
						<li>
							<button
								type="button"
								class="dropdown-item justify-content-between"
								data-bs-toggle="modal"
								data-bs-target="#delete-challenge"
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
