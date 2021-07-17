<script lang="ts">
	import { goto } from '$app/navigation';
	import { createJournel } from '$lib/state/journels';

	export let journelNameFilter: string;

	let journelName = '';
	let journelCreating = false;

	async function onCreateJournel() {
		journelCreating = true;
		try {
			const name = journelName.trim(),
				[localId, _journel] = await createJournel(name ? name : new Date().toDateString());
			journelName = '';
			goto(`/journels/${localId}`);
		} finally {
			journelCreating = false;
		}
	}
</script>

<div class="input-group mt-2">
	<input
		type="text"
		class="form-control"
		placeholder="New Name (Leave blank to use current Date)"
		aria-label="New Name (Leave blank to use current Date)"
		required
		bind:value={journelName}
	/>
	<button
		type="submit"
		disabled={journelCreating}
		class="btn btn-primary"
		aria-label="Create"
		on:click={onCreateJournel}
	>
		{#if journelCreating}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</div>
<div class="input-group mt-2 mb-4">
	<input
		type="text"
		class="form-control"
		placeholder="Filter by name"
		bind:value={journelNameFilter}
	/>
</div>
