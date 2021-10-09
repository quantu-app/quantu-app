import type { Asset } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';

const selectedAssetsWritable = writable(new Set<Asset>());
const organizationIdAssetsWritable = writable(null);

export const selectedAssets: Readable<Set<Asset>> = {
	subscribe: selectedAssetsWritable.subscribe
};

export const organizationIdAssets: Readable<number> = {
	subscribe: organizationIdAssetsWritable.subscribe
};

export function toggleSelectedAsset(asset: Asset) {
	selectedAssetsWritable.update((assets) => {
		if (assets.has(asset)) {
			assets.delete(asset);
		} else {
			assets.add(asset);
		}
		return assets;
	});
}

export function setOrganizationIdAssets(organizationId: number) {
	organizationIdAssetsWritable.set(organizationId);
}
