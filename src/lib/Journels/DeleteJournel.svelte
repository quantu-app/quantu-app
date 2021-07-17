<script lang="ts">
	import type { Journel } from '$lib/api/quantu-app-api';

	export let journelToDelete: Journel;
	export let onDeleteJournel: () => void;

	let deleteJournelText = '';

	function internalOnDeleteJournel() {
		deleteJournelText = '';
		onDeleteJournel();
	}
</script>

<div
	class="modal fade"
	id="delete-journel"
	tabindex="-1"
	aria-labelledby="delete-journel-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-journel-label" class="modal-title">Delete {journelToDelete?.name}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteJournelText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteJournel}
					disabled={deleteJournelText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
