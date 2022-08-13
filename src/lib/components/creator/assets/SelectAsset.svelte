<svelte:options immutable />

<script lang="ts">
	import { browser } from '$app/env';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { showAssetById } from '$lib/state/creator/assets';
	import type { Asset } from '@prisma/client';
	import AssetComponent from './Asset.svelte';
	import AssetManager from './AssetManager.svelte';

	export let departmentId: string;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let asset: Asset | undefined = undefined;
	export let assetId: string | null | undefined = undefined;
	export let type: string | undefined = undefined;
	export let onChange: (fieldName?: string) => void = () => undefined;

	let open = false;
	function onOpen() {
		open = true;
	}

	let folder = '';
	$: if (browser && assetId && !asset) {
		showAssetById(departmentId, assetId).then((a) => {
			asset = a;
			folder = a.folder;
		});
	}
	function onSelect(a?: Asset) {
		assetId = a?.id;
		onChange(name);
	}
</script>

<button {id} {name} type="button" class="btn btn-primary w-100 d-block" on:click={onOpen}>
	{#if asset}
		<AssetComponent {asset} />
	{:else}
		Select/Upload
	{/if}
</button>

<Modal bind:open>
	<svelte:fragment slot="header">Select/Upload Asset</svelte:fragment>
	<AssetManager {departmentId} {type} bind:selectAsset={asset} bind:folder {onSelect} />
	<button
		slot="footer"
		type="button"
		class="btn btn-primary text-white"
		disabled={!asset}
		data-bs-dismiss="modal">Select</button
	>
</Modal>
