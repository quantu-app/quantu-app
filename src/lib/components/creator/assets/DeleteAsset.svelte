<svelte:options immutable />

<script lang="ts">
	import { deleteAsset } from '$lib/state/creator/assets';
	import type { Asset } from '@prisma/client';

	export let assetToDelete: Asset = undefined;
	export let onDeleteAsset: () => void = () => undefined;

	let deletingAsset = false;
	function onDeleteAssetInternal() {
		deletingAsset = true;
		try {
			deleteAsset(assetToDelete.departmentId, assetToDelete.folder, assetToDelete.name);
			assetToDelete = undefined;
			onDeleteAsset();
		} finally {
			deletingAsset = false;
		}
	}

	let deleteModalElement: HTMLDivElement;
	$: deleteModal =
		deleteModalElement && window.bootstrap.Modal.getOrCreateInstance(deleteModalElement);
	$: if (assetToDelete && deleteModal) {
		deleteModal.show();
	}
</script>

<div
	bind:this={deleteModalElement}
	class="modal fade"
	id="delete-asset"
	tabindex="-1"
	aria-labelledby="delete-asset-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-asset-label" class="modal-title">
					Delete {assetToDelete?.folder}/{assetToDelete?.name}?
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<p>Are you sure you want to delete {assetToDelete?.name}?</p>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteAssetInternal}
					class="btn btn-danger text-white"
					disabled={deletingAsset}
				>
					{#if deletingAsset}
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
