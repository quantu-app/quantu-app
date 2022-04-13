import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { AssetType, PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const get = authenticated((event: RequestEvent) => {
	const departmentId = event.params.departmentId;
	const type = event.url.searchParams.get('type');

	return run((client) =>
		listAssets(client, departmentId, '', type?.toUpperCase() as AssetType)
	).then((assets) => ({
		body: assets,
		status: 200
	}));
});

export async function listAssets(
	client: PrismaClient,
	departmentId: string,
	folder: string,
	type?: AssetType
) {
	const children = await client.asset.findMany({
		where: {
			departmentId,
			type,
			folder: {
				startsWith: folder
			}
		},
		select: {
			folder: true
		}
	});

	const folders = children
		.map((child) => {
			let path = child.folder;
			if (folder) {
				path = path.slice(folder.length + 1);
			}
			return path.split('/')[0];
		})
		.filter((child) => !!child);

	const assets = await client.asset.findMany({
		where: {
			departmentId,
			type,
			folder
		}
	});

	return { folders, assets };
}
