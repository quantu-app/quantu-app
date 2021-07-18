<script lang="ts">
	import type { Journal } from '$lib/api/quantu-app-api';

	export let journalToDelete: Journal;
	export let onDeleteJournal: () => void;

	let deleteJournalText = '';

	function internalOnDeleteJournal() {
		deleteJournalText = '';
		onDeleteJournal();
	}
</script>

<div
	class="modal fade"
	id="delete-journal"
	tabindex="-1"
	aria-labelledby="delete-journal-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-journal-label" class="modal-title">Delete {journalToDelete?.name}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteJournalText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteJournal}
					disabled={deleteJournalText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
