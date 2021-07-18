<script lang="ts">
	import { goto } from '$app/navigation';
	import { createJournal } from '$lib/state/journals';

	export let journalNameFilter: string;

	let journalName = '';
	let journalCreating = false;

	async function onCreateJournal() {
		journalCreating = true;
		try {
			const name = journalName.trim(),
				[localId, _journal] = await createJournal(
					name
						? name
						: new Date().toLocaleString('en-us', {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
						  })
				);
			journalName = '';
			goto(`/journals/${localId}`);
		} finally {
			journalCreating = false;
		}
	}
</script>

<form on:submit|preventDefault class="mt-2 row justify-content-between align-items-end">
	<div class="col-lg-6">
		<div class="input-group">
			<input
				type="text"
				class="form-control"
				placeholder="Name (Leave empty to use Date)"
				aria-label="Name (Leave empty to use Date)"
				required
				bind:value={journalName}
			/>
			<button
				type="submit"
				disabled={journalCreating}
				class="btn btn-primary"
				aria-label="Create"
				on:click={onCreateJournal}
			>
				{#if journalCreating}
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
				{/if}
				Create
			</button>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="input-group">
			<input
				type="text"
				class="form-control"
				placeholder="Filter by name"
				bind:value={journalNameFilter}
			/>
		</div>
	</div>
</form>
