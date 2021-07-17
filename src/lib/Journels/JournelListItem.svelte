<script lang="ts">
	import type { Journel } from '$lib/api/quantu-app-api';

	export let localId: string;
	export let journel: Journel;
	export let onDelete: () => void;

	$: updatedAt = new Date(journel.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>{journel.name}</h4>
		<div class="btn-group" role="group">
			<a type="button" class="btn btn-primary" aria-label="Edit" href={`/journels/${localId}`}
				><i class="bi bi-pencil" /></a
			>
			<button
				type="button"
				class="btn btn-danger text-white"
				data-bs-toggle="modal"
				data-bs-target="#delete-journel"
				aria-label="Delete"
				on:click={onDelete}><i class="bi bi-trash" /></button
			>
		</div>
	</div>
	<p class="mb-0">Last updated {updatedAt.toLocaleTimeString()} {updatedAt.toLocaleDateString()}</p>
</div>
