import { browser } from '$app/env';
import type { Asset, AssetCreate } from '$lib/api/quantu-app-api';
import { UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';
import { request as __request } from '$lib/api/quantu-app-api/core/request';

interface IOrganizationAssetsStore {
	byId: { [id: number]: Asset };
	byParentId: {
		[parentId: number]: { [id: number]: Asset };
	};
	byOrganizationId: {
		[organizationId: number]: { [id: number]: Asset };
	};
}

const organizationAssetsWritable = writable<IOrganizationAssetsStore>({
	byId: {},
	byParentId: {},
	byOrganizationId: {}
});

export const organizationAssets: Readable<IOrganizationAssetsStore> = {
	subscribe: organizationAssetsWritable.subscribe
};

export async function getAsset(organizationId: number, id: number) {
	const cachedAsset = get(organizationAssets).byId[id];
	if (cachedAsset) {
		return cachedAsset;
	}
	const asset = await load(UserService.quantuAppWebControllerUserAssetShow(id, organizationId));
	organizationAssetsWritable.update((state) => addToState(state, asset));
	return asset;
}

export async function getAssets(organizationId: number, parentId?: number, force = false) {
	if (!force) {
		if (parentId) {
			const cachedQuestions = Object.values(
				get(organizationAssetsWritable).byParentId[parentId] || {}
			);
			if (cachedQuestions.length) {
				if (organizationId) {
					return cachedQuestions.filter((asset) => asset.organizationId === organizationId);
				} else {
					return cachedQuestions;
				}
			}
		} else if (organizationId) {
			const cachedQuestions = Object.values(
				get(organizationAssetsWritable).byOrganizationId[organizationId] || {}
			);
			if (cachedQuestions.length) {
				return cachedQuestions;
			}
		} else {
			const cachedQuestions = Object.values(get(organizationAssetsWritable).byId || {});
			if (cachedQuestions.length) {
				return cachedQuestions;
			}
		}
	}
	const assets = await load(
		UserService.quantuAppWebControllerUserAssetIndex(organizationId, parentId)
	);
	organizationAssetsWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		state.byOrganizationId[parentId] = {};
		return assets.reduce(addToState, state);
	});
	return assets;
}

export async function createAsset(organizationId: number, params: AssetCreate) {
	const asset = await load(
		__request({
			method: 'POST',
			path: `/user/organizations/${organizationId}/assets`,
			formData: params
		}).then((response) => response.body as Asset)
	);
	organizationAssetsWritable.update((state) => addToState(state, asset));
	return asset;
}

export async function updateAsset(organizationId: number, id: number, params: Partial<Asset>) {
	const asset = await load(
		UserService.quantuAppWebControllerUserAssetUpdate(id, organizationId, params)
	);
	organizationAssetsWritable.update((state) => addToState(state, asset));
	return asset;
}

export async function deleteAsset(organizationId: number, id: number) {
	const asset = get(organizationAssetsWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserAssetDelete(asset.id, organizationId));
	organizationAssetsWritable.update((state) => deleteFromState(state, asset));
}

function addToState(state: IOrganizationAssetsStore, asset: Asset): IOrganizationAssetsStore {
	const byOrganizationId =
			state.byOrganizationId[asset.organizationId] ||
			(state.byOrganizationId[asset.organizationId] = {}),
		byParentId = state.byParentId[asset.parentId] || (state.byParentId[asset.parentId] = {});
	byOrganizationId[asset.id] = asset;
	byParentId[asset.id] = asset;
	state.byId[asset.id] = asset;
	return state;
}

function deleteFromState(state: IOrganizationAssetsStore, asset: Asset): IOrganizationAssetsStore {
	const byOrganizationId =
			state.byOrganizationId[asset.organizationId] ||
			(state.byOrganizationId[asset.organizationId] = {}),
		byParentId = state.byParentId[asset.parentId] || (state.byParentId[asset.parentId] = {});
	delete byOrganizationId[asset.id];
	delete byParentId[asset.id];
	delete state.byId[asset.id];
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		organizationAssetsWritable.set({
			byId: {},
			byParentId: {},
			byOrganizationId: {}
		})
	);
}
