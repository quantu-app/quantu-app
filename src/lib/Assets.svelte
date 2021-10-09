<script lang="ts">
	import type { Asset } from '$lib/api/quantu-app-api';
	import { getAssets, organizationAssets } from '$lib/state/organizationAssets';
	import { selectedAssets, toggleSelectedAsset } from './state/selectedAssets';

	export let organizationId: number;
	export let multiple = false;

	let parentId: number | undefined;
	let prevParentId: number | undefined = {} as any;
	$: assets = Object.values($organizationAssets.byParentId[parentId || null] || {});

	$: if (parentId !== prevParentId) {
		prevParentId = parentId;
		getAssets(organizationId, parentId);
	}

	function createOnSelect(asset: Asset) {
		return function onSelect() {
			toggleSelectedAsset(asset);
		};
	}
</script>

<div class="container-fluid">
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
						<img
							src={`${import.meta.env.VITE_API_URL}/${asset.url}`}
							alt={asset.name}
							width="100%"
						/>
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
