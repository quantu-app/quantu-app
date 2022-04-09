<script context="module" lang="ts">
	import { get, writable } from 'svelte/store';

	interface IState {
		folder: string;
	}

	const state = writable<IState>({
		folder: ''
	});
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { assets, deleteAsset, showAssets, uploadAsset } from '$lib/state/creator/assets';
	import AssetComponent from './Asset.svelte';
	import type { Asset } from '@prisma/client';

	export let departmentId: string;
	export let type: string = undefined;
	export let folder = '';

	$: state.update((state) => ({ ...state, folder }));
	$: if (browser) {
		showAssets(departmentId, $state.folder, type);
	}
	$: tree = $assets.get(departmentId).list($state.folder);

	function createOnClickFolder(f: string) {
		return () => {
			state.update((state) => ({ ...state, folder: state.folder ? state.folder + '/' + f : f }));
		};
	}

	let active: Asset = undefined;
	let viewModalElement: HTMLDivElement;
	$: viewModal = viewModalElement && window.bootstrap.Modal.getOrCreateInstance(viewModalElement);
	function createOnActive(asset: Asset) {
		return () => {
			active = asset;
			viewModal.show();
		};
	}

	let assetToDelete: Asset = undefined;
	let deletingAsset = false;
	let deleteModalElement: HTMLDivElement;
	$: deleteModal =
		deleteModalElement && window.bootstrap.Modal.getOrCreateInstance(deleteModalElement);
	function createOnDelete(asset: Asset) {
		return () => {
			assetToDelete = asset;
			deleteModal.show();
		};
	}
	async function onDeleteAsset() {
		deletingAsset = true;
		try {
			await deleteAsset(departmentId, assetToDelete.folder, assetToDelete.name);
			assetToDelete = undefined;
			deleteModal.hide();
		} finally {
			deletingAsset = false;
		}
	}

	function onParent() {
		const { folder } = get(state);
		const index = folder.lastIndexOf('/');
		if (index !== -1) {
			state.update((state) => ({ ...state, folder: folder.substring(0, index) }));
		} else {
			state.update((state) => ({ ...state, folder: '' }));
		}
	}

	let files: FileList;
	let uploadFolder: string;
	let uploading = false;
	let fileInput: HTMLInputElement;
	function onUpload() {
		if (!files || files.length !== 1) {
			return;
		}
		uploading = true;
		try {
			const file = files[0];
			const folder = uploadFolder || get(state).folder;
			const reader = new FileReader();
			reader.onload = async (e) => {
				await uploadAsset(departmentId, folder, file.name, e.target.result);
				uploadFolder = '';
				fileInput.value = '';
			};
			reader.readAsArrayBuffer(file);
		} finally {
			uploading = false;
		}
	}
</script>

<div>
	<form on:submit|preventDefault on:submit={onUpload}>
		<div class="row">
			<div class="col-md">
				<div class="input-group">
					<input
						class="form-control"
						type="text"
						bind:value={uploadFolder}
						placeholder={`Folder (defaults to ${$state.folder || 'current'})`}
					/>
				</div>
			</div>
			<div class="col-md">
				<input bind:this={fileInput} class="form-control" type="file" multiple={false} bind:files />
			</div>
			<div class="col-auto">
				<input
					class="form-control btn btn-primary"
					type="submit"
					value="Upload"
					disabled={uploading}
				/>
			</div>
		</div>
	</form>
</div>

<hr />

<ul class="list-group list-group-flush">
	{#if $state.folder}
		<li class="list-group-item list-group-item-action" on:click={onParent} role="button">
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary" disabled>
					<i class="bi bi-arrow-left" />
				</button>
				<p class="d-flex flex-grow-1 p-2 m-0">...</p>
			</div>
		</li>
	{:else}
		<li class="list-group-item list-group-item-action" role="button">
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary" disabled>
					<i class="bi bi-dash" />
				</button>
				<p class="d-flex flex-grow-1 p-2 m-0">.</p>
			</div>
		</li>
	{/if}
	{#each tree.folders() as folder (folder)}
		<li
			class="list-group-item list-group-item-action"
			on:click={createOnClickFolder(folder)}
			role="button"
		>
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary" disabled><i class="bi bi-folder" /></button>
				<p class="d-flex flex-grow-1 p-2 m-0">{folder}</p>
			</div>
		</li>
	{/each}
	{#each tree.assets as asset (asset.id)}
		<li class="list-group-item list-group-item-action" role="button">
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary"> <i class="bi bi-file-earmark" /></button>
				<p class="d-flex flex-grow-1 p-2 m-0">{asset.name}</p>
				<button class="btn btn-danger me-2" on:click={createOnDelete(asset)}>Delete</button>
				<button class="btn btn-primary" on:click={createOnActive(asset)}>View</button>
			</div>
		</li>
	{/each}
</ul>

<div
	bind:this={viewModalElement}
	class="modal fade"
	id="view-asset"
	tabindex="-1"
	aria-labelledby="view-asset-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="view-asset-label" class="modal-title">{active?.folder}/{active?.name}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if active}
					<AssetComponent asset={active} />
				{/if}
			</div>
		</div>
	</div>
</div>

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
				{#if assetToDelete}
					<p>Are you sure you want to delete this asset?</p>
				{/if}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteAsset}
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
