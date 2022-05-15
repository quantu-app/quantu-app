<svelte:options immutable />

<script lang="ts">
	export let onDelete: () => Promise<void>;

	let deleting = false;
	async function internalOnDelete() {
		deleting = true;
		try {
			await onDelete();
		} finally {
			deleting = false;
		}
	}
</script>

<div
	class="modal fade"
	id="delete-solution"
	tabindex="-1"
	aria-labelledby="delete-solution-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-solution-label" class="modal-title">
					Delete your Solution to this Challenge
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<p>This will delete all comments as well from your solution.</p>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDelete}
					class="btn btn-danger text-white"
					disabled={deleting}
				>
					{#if deleting}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete</button
				>
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
