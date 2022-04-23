<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		folder: string;
	}

	const state = writable<IState>({
		folder: ''
	});
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { assets, showAssets } from '$lib/state/creator/assets';
	import AssetUpload from './AssetUpload.svelte';
	import DeleteAsset from './DeleteAsset.svelte';
	import AssetList from './AssetList.svelte';
	import type { Asset } from '@prisma/client';

	export let departmentId: string;
	export let type: string = undefined;
	export let folder = '';
	export let selectAsset: Asset = undefined;
	export let onSelect: (asset?: Asset) => void = () => undefined;

	let assetToDelete: Asset = undefined;
	$: tree = $assets.get(departmentId);

	$: if (browser && departmentId) {
		loadAssets();
	}
	$: state.update((state) => ({ ...state, folder }));
	$: state.update((state) => ({ ...state, folder: tree.folder }));

	let loading = false;
	async function loadAssets() {
		if (!loading) {
			loading = true;
			try {
				showAssets(departmentId, $state.folder, type);
			} finally {
				loading = false;
			}
		}
	}
</script>

<div>
	<AssetUpload {departmentId} folder={$state.folder} />
</div>

<hr />

<AssetList bind:tree bind:selectAsset bind:assetToDelete {onSelect} />

<DeleteAsset bind:assetToDelete />
