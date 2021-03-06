import type { Asset } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import mime from 'mime';
import { readFileToArrayBuffer, type IFetch } from '$lib/utils';

interface IAssetList {
	folders: string[];
	assets: Asset[];
}

export class AssetTree {
	folder = '';
	parent: AssetTree | undefined = undefined;
	children: Record<string, AssetTree> = {};
	assets: Asset[] = [];
	byId: Record<string, Asset> = {};

	constructor(folder = '', parent?: AssetTree) {
		this.folder = folder;
		if (parent) {
			this.parent = parent;
			this.byId = parent.byId;
		}
	}

	folders() {
		return Object.keys(this.children);
	}
	list(folder = '') {
		return this.getOrCreateFolder(folder);
	}
	hasFolder(folder: string) {
		const parts = folder.split('/');
		let current = parts.shift();
		let currentTree = this as AssetTree;

		while (current) {
			if (!currentTree.children[current]) {
				return false;
			}
			currentTree = currentTree.children[current];
			current = parts.shift();
		}

		return true;
	}
	getOrCreateFolder(folder: string) {
		const parts = folder.split('/');
		let current = parts.shift();
		let currentTree = this as AssetTree;

		while (current) {
			if (!currentTree.children[current]) {
				currentTree.children[current] = new AssetTree(current, currentTree);
			}
			currentTree = currentTree.children[current];
			current = parts.shift();
		}

		return currentTree;
	}
	addAsset(asset: Asset) {
		const tree = this.getOrCreateFolder(asset.folder);
		const index = tree.assets.findIndex((a) => a.id === asset.id);
		if (index === -1) {
			tree.assets.push(asset);
		} else {
			tree.assets[index] = asset;
		}
		tree.byId[asset.id] = asset;
		return this;
	}
	removeAsset(asset: Asset) {
		const tree = this.getOrCreateFolder(asset.folder);
		const index = tree.assets.findIndex((a) => a.id === asset.id);
		if (index !== -1) {
			tree.assets.splice(index, 1);
		}
		return this;
	}

	toJSON() {
		return {
			children: Object.entries(this.children).reduce((acc, [folder, tree]) => {
				acc[folder] = tree.toJSON();
				return acc;
			}, {} as { [key: string]: any }),
			assets: this.assets
		};
	}
}

export class DepartmentAssetTrees {
	trees: Record<string, AssetTree>;

	constructor() {
		this.trees = {};
	}

	get(departmentId: string) {
		let tree = this.trees[departmentId];
		if (!tree) {
			tree = new AssetTree();
			this.trees[departmentId] = tree;
		}
		return tree;
	}

	toJSON() {
		return this.trees;
	}
}

const assetsWritable = writable(new DepartmentAssetTrees());

export const assets = derived(assetsWritable, (assetsWritable) => assetsWritable);

export async function showAssetById(
	departmentId: string,
	id: string,
	fetchFn: IFetch = fetch
): Promise<Asset> {
	const cachedAsset = get(assetsWritable).get(departmentId).byId[id];
	if (cachedAsset) {
		return cachedAsset;
	}
	const res = await fetchFn(`${base}/api/creator/assets/${id}`);
	if (!res.ok) {
		throw await res.json();
	}
	const asset = assetFromJSON(await res.json());
	assetsWritable.update((state) => {
		const tree = state.get(departmentId);
		tree.addAsset(asset);
		return state;
	});
	return asset;
}

export async function showAssets(
	departmentId: string,
	folder = '',
	type?: string,
	fetchFn: IFetch = fetch
): Promise<Asset[]> {
	const res = await fetchFn(
		`${base}/api/creator/departments/${departmentId}/assets${folder ? `/${folder}` : folder}${
			type ? `?type=${type}` : ''
		}`
	);
	if (!res.ok) {
		throw await res.json();
	}
	const { folders, assets } = assetListFromJSON(await res.json());
	assetsWritable.update((state) => {
		const tree = state.get(departmentId);
		folders.forEach((folder) => tree.getOrCreateFolder(folder));
		assets.forEach((asset) => tree.addAsset(asset));
		return state;
	});
	return assets;
}

export async function uploadAsset(departmentId: string, folder = '', name: string, file: File) {
	const ext = name.substring(name.lastIndexOf('.'));
	const res = await fetch(
		`${base}/api/creator/departments/${departmentId}/assets${
			folder ? `/${folder}` : folder
		}/${name}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': mime.getType(ext) as string
			},
			body: await readFileToArrayBuffer(file)
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const asset: Asset = assetFromJSON(await res.json());
	assetsWritable.update((state) => {
		state.get(asset.departmentId).addAsset(asset);
		return state;
	});
	return asset;
}

export async function deleteAsset(departmentId: string, folder = '', name: string) {
	const res = await fetch(
		`${base}/api/creator/departments/${departmentId}/assets${
			folder ? `/${folder}` : folder
		}/${name}`,
		{
			method: 'DELETE'
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const asset: Asset = assetFromJSON(await res.json());
	assetsWritable.update((state) => {
		state.get(asset.departmentId).removeAsset(asset);
		return state;
	});
}

function assetListFromJSON(assetList: IAssetList): IAssetList {
	return {
		folders: assetList.folders,
		assets: assetList.assets.map(assetFromJSON)
	};
}

function assetFromJSON(asset: Asset): Asset {
	return {
		...asset,
		createdAt: new Date(asset.createdAt),
		updatedAt: new Date(asset.updatedAt)
	};
}
