<svelte:options immutable />

<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import { deleteAsset } from '$lib/state/creator/assets';
	import type { Asset } from '@prisma/client';

	export let open: boolean;
	export let assetToDelete: Asset = undefined;
	export let onDeleteAsset: () => void = () => undefined;

	let deletingAsset = false;
	function onDeleteAssetInternal() {
		deletingAsset = true;
		try {
			deleteAsset(assetToDelete.departmentId, assetToDelete.folder, assetToDelete.name);
			assetToDelete = undefined;
			open = false;
			onDeleteAsset();
		} finally {
			deletingAsset = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header"
		>Delete {assetToDelete?.folder}/{assetToDelete?.name}?</svelte:fragment
	>
	<p>Are you sure you want to delete {assetToDelete?.name}?</p>
	<button
		slot="footer"
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
</Modal>
