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

<form on:submit|preventDefault>
	<div class="input-group mt-2">
		<input
			type="text"
			class="form-control"
			placeholder="Name (Leave blank to use current Date)"
			aria-label="Name (Leave blank to use current Date)"
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
	<div class="input-group mt-2 mb-4">
		<input
			type="text"
			class="form-control"
			placeholder="Filter by name"
			bind:value={journalNameFilter}
		/>
	</div>
</form>
