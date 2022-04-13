<script lang="ts">
	import type { AssetTree } from '$lib/state/creator/assets';
	import type { Asset } from '@prisma/client';
	import AssetComponent from './Asset.svelte';

	export let tree: AssetTree;
	export let selectAsset: Asset = undefined;
	export let assetToDelete: Asset = undefined;
	export let onSelect: (asset: Asset) => void = () => undefined;

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
		};
	}
	function createOnSelect(asset: Asset) {
		return () => {
			selectAsset = asset;
			onSelect(selectAsset);
		};
	}
</script>

<ul class="grid">
	{#if tree.parent}
		<div class="g-col-3" role="button" on:click={onSelectParent}>
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary" disabled>
					<i class="bi bi-arrow-left" />
				</button>
				<p class="d-flex flex-grow-1 p-2 m-0">...</p>
			</div>
		</div>
	{:else}
		<div class="g-col-3" role="button">
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary" disabled>
					<i class="bi bi-dash" />
				</button>
				<p class="d-flex flex-grow-1 p-2 m-0">.</p>
			</div>
		</div>
	{/if}
	{#each tree.folders() as folder (folder)}
		<div class="g-col-3" on:click={createOnClickFolder(folder)} role="button">
			<div class="d-flex justify-content-between">
				<button class="btn btn-primary" disabled><i class="bi bi-folder" /></button>
				<p class="d-flex flex-grow-1 p-2 m-0">{folder}</p>
			</div>
		</div>
	{/each}
	{#each tree.assets as asset (asset.id)}
		<div class="g-col-3" role="button" on:click={createOnSelect(asset)}>
			<div>
				<AssetComponent {asset} />
				<div class="d-flex justify-content-between">
					<button class="btn btn-primary"> <i class="bi bi-file-earmark" /></button>
					<p class="d-flex flex-grow-1 p-2 m-0">{asset.name}</p>
					<button class="btn btn-danger me-2" on:click|stopPropagation={createOnDelete(asset)}
						>Delete</button
					>
				</div>
			</div>
		</div>
	{/each}
</ul>
