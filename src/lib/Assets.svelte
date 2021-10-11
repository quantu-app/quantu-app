<script lang="ts">
	import type { Asset } from '$lib/api/quantu-app-api';
	import {
		createAsset,
		deleteAsset,
		getAssets,
		organizationAssets
	} from '$lib/state/organizationAssets';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { API_URL } from '$lib/constants';
	import { selectedAssets, toggleSelectedAsset } from './state/selectedAssets';

	export let organizationId: number;
	export let multiple = false;

	let parentId: number;
	let prevParentId: number = {} as any;

	$: if (parentId !== prevParentId) {
		prevParentId = parentId;
		getAssets(organizationId, parentId);
	}
	$: assets = Object.values(get(organizationAssets).byParentId[parentId || null] || {});

	function createOnSelect(asset: Asset) {
		return function onSelect() {
			toggleSelectedAsset(asset);
		};
	}

	function onDelete() {
		return Promise.all(
			Array.from(get(selectedAssets)).map((asset) => {
				toggleSelectedAsset(asset);
				return deleteAsset(organizationId, asset.id);
			})
		);
	}

	let fileInput: HTMLInputElement;
	function onAdd() {
		fileInput.click();
	}

	async function onFileInputChange(e: InputEvent) {
		const files = (e.target as HTMLInputElement).files,
			tasks: Promise<Asset>[] = [];

		for (let i = 0, il = files.length; i < il; i++) {
			const file = files[i];
			tasks.push(
				createAsset(organizationId, {
					name: file as any
				})
			);
		}

		await Promise.all(tasks);
	}

	onMount(() => {
		fileInput.addEventListener('change', onFileInputChange);
	});
</script>

<div class="container-fluid">
	<div class="d-flex justify-content-end">
		<div>
			<button
				role="button"
				class="btn btn-danger text-white w-100"
				class:d-none={$selectedAssets.size === 0}
				on:click={onDelete}>Delete</button
			>
		</div>
		<div>
			<button role="button" class="btn btn-primary w-100" on:click={onAdd}>Add</button>
		</div>
		<input bind:this={fileInput} type="file" {multiple} class="d-none" />
	</div>
	<div
		class="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-10"
	>
		{#each assets as asset (asset.id)}
			{#if asset.type === 'folder'}
				<div class="col mb-4">
					<div class="card text-white border border-4 border-white">
						<div class="card-body">
							<h5 class="card-title">{asset.name}</h5>
							<p class="card-text">{asset.type}</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="col mb-4" on:click={createOnSelect(asset)}>
					<div
						class="card text-white border border-4"
						class:border-white={!$selectedAssets.has(asset)}
						class:border-primary={$selectedAssets.has(asset)}
					>
						<img src={`${API_URL}/${asset.url}`} alt={asset.name} width="100%" />
						<div class="card-img-overlay">
							<h5 class="card-title">{asset.name}</h5>
							<p class="card-text">{asset.type}</p>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	h5,
	p {
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
	}
</style>
