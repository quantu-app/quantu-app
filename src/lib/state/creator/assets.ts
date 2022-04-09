import type { Asset } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import mime from 'mime';

interface IAssetList {
	folders: Array<string>;
	assets: Array<Asset>;
}

export class AssetTree {
	children: Record<string, AssetTree> = {};
	assets: Array<Asset> = [];

	folders() {
		return Object.keys(this.children);
	}
	list(folder = '') {
		return this.getOrCreateFolder(folder);
	}
	getOrCreateFolder(folder: string) {
		const parts = folder.split('/');
		let current = parts.shift();
		let currentTree = this as AssetTree;

		while (current) {
			if (!currentTree.children[current]) {
				currentTree.children[current] = new AssetTree();
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
			}, {}),
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

export async function showAssets(
	departmentId: string,
	folder = '',
	type?: string
): Promise<Asset[]> {
	const res = await fetch(
		`${base}/api/creator/departments/${departmentId}/assets/${folder}${type ? `?type=${type}` : ''}`
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

export async function uploadAsset(
	departmentId: string,
	folder = '',
	name: string,
	body: FileReader['result']
) {
	const ext = name.substring(name.lastIndexOf('.'));
	const res = await fetch(
		`${base}/api/creator/departments/${departmentId}/assets/${folder}/${name}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': mime.getType(ext)
			},
			body
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
		`${base}/api/creator/departments/${departmentId}/assets/${folder}/${name}`,
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
