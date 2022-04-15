<script lang="ts">
	import { browser } from '$app/env';
	import { showAssetById } from '$lib/state/creator/assets';
	import type { Asset } from '@prisma/client';
	import Portal from 'svelte-portal/src/Portal.svelte';
	import AssetComponent from './Asset.svelte';
	import AssetManager from './AssetManager.svelte';

	export let departmentId: string;
	export let id: string = undefined;
	export let asset: Asset = undefined;
	export let assetId: string = undefined;
	export let type: string = undefined;

	let folder = '';
	$: if (browser && assetId && !asset) {
		showAssetById(departmentId, assetId).then((a) => {
			asset = a;
			folder = a.folder;
		});
	}
	function onSelect(a?: Asset) {
		assetId = a?.id;
	}
</script>

<button
	{id}
	type="button"
	data-bs-toggle="modal"
	data-bs-target="#select-asset"
	class="btn btn-primary w-100 d-block"
>
	{#if asset}
		<AssetComponent {asset} />
	{:else}
		Select/Upload
	{/if}
</button>

<Portal>
	<div
		class="modal fade"
		id="select-asset"
		tabindex="-1"
		aria-labelledby="select-asset-label"
		aria-hidden="true"
	>
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 id="select-asset-label" class="modal-title">Select/Upload Asset</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<AssetManager {departmentId} {type} bind:selectAsset={asset} bind:folder {onSelect} />
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-primary text-white"
						disabled={!asset}
						data-bs-dismiss="modal">Select</button
					>
					<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
						>Close</button
					>
				</div>
			</div>
		</div>
	</div>
</Portal>
