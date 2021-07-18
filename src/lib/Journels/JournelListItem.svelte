<script lang="ts">
	import type { Journel } from '$lib/api/quantu-app-api';

	export let localId: string;
	export let journel: Journel;
	export let onDelete: () => void;

	$: insertedAt = new Date(journel.insertedAt || '');
	$: updatedAt = new Date(journel.updatedAt || '');

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<span class="badge bg-primary">{insertedAt.toLocaleString('en-us', { day: 'numeric' })}</span>
			-
			<a aria-label="Edit" href={`/journels/${localId}`}>{journel.name}</a>
		</h4>
		<div class="dropdown">
			<button
				id={`dropdown-${localId}`}
				class="btn btn-ghost dropdown-toggle"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				<i class="bi bi-three-dots-vertical" />
			</button>
			<ul class="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${localId}`}>
				<li>
					<a class="dropdown-item justify-content-between" href={`/journels/${localId}`}>Edit</a>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-journel"
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
		{#if innerWidth >= 768}
			<div class="flex-grow-1" />
			<div class="d-inline" style="margin-right:60px;">
				<p class="mb-0">{journel.location}, {journel.language}, {journel.wordCount} words</p>
			</div>
		{/if}
	</div>
</div>
