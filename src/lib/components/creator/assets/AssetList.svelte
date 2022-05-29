<script lang="ts">
	import type { AssetTree } from '$lib/state/creator/assets';
	import type { Asset } from '@prisma/client';
	import AssetComponent from './Asset.svelte';

	export let tree: AssetTree;
	export let selectAsset: Asset = undefined;
	export let assetToDelete: Asset = undefined;
	export let deleteOpen: boolean;
	export let onSelect: (asset?: Asset) => void = () => undefined;

	function onSelectParent() {
		if (tree.parent) {
			tree = tree.parent;
		}
	}
	function createOnClickFolder(folder: string) {
		return () => {
			tree = tree.getOrCreateFolder(folder);
		};
	}
	function createOnDelete(asset: Asset) {
		return () => {
			assetToDelete = asset;
			deleteOpen = true;
		};
	}
	function createOnSelect(asset: Asset) {
		return () => {
			if (selectAsset === asset) {
				selectAsset = undefined;
			} else {
				selectAsset = asset;
			}
			onSelect(selectAsset);
		};
	}
</script>

<div class="grid">
	{#if tree.parent}
		<div class="g-col-3" role="button" on:click={onSelectParent}>
			<button class="btn btn-primary" disabled>
				<i class="bi bi-arrow-left" /> ...
			</button>
		</div>
	{:else}
		<div class="g-col-3" role="button">
			<button class="btn btn-primary" disabled>
				<i class="bi bi-dash" /> .
			</button>
		</div>
	{/if}
	{#each tree.folders() as folder (folder)}
		<div class="g-col-3" on:click={createOnClickFolder(folder)} role="button">
			<button class="btn btn-primary" disabled><i class="bi bi-folder" /> {folder}</button>
		</div>
	{/each}
	{#each tree.assets as asset (asset.id)}
		<div
			class="g-col-3 border-3"
			class:border={selectAsset?.id === asset.id}
			role="button"
			on:click={createOnSelect(asset)}
		>
			<div class="position-relative overflow-hidden">
				<div class="text-center">
					<AssetComponent {asset} />
				</div>
				<p class="position-absolute top-0 left-0">{asset.name}</p>
				<button
					class="position-absolute bottom-0 right-0 btn btn-danger"
					on:click|stopPropagation={createOnDelete(asset)}>Delete</button
				>
			</div>
		</div>
	{/each}
</div>
