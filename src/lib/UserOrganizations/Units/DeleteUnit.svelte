<script lang="ts">
	import type { Unit } from '$lib/api/quantu-app-api';

	export let unit: Unit;
	export let onDeleteUnit: () => Promise<void>;

	let deletingUnit = false;

	async function internalOnDeleteUnit() {
		deletingUnit = true;
		try {
			await onDeleteUnit();
		} finally {
			deletingUnit = false;
		}
	}
</script>

<div
	class="modal fade"
	id="delete-unit"
	tabindex="-1"
	aria-labelledby="delete-unit-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-unit-label" class="modal-title">
					Delete {unit?.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteUnit}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white"
				>
					{#if deletingUnit}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete
				</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
