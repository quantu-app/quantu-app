import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { AssetType, PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = isCreator((event: RequestEvent) => {
	const departmentId = event.params.departmentId as string;
	const type = event.url.searchParams.get('type');

	return run((client) =>
		listAssets(client, departmentId, '', type?.toUpperCase() as AssetType)
	).then((assets) => new Response(JSON.stringify(assets), { status: 200 }));
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
