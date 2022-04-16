import { extname } from 'path';
import mime from 'mime';
import { s3Get } from '$lib/s3';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export async function get(event: RequestEvent) {
	return run((client) => getAssetById(client, event.params.id))
		.then((asset) =>
			asset
				? s3Get([asset.departmentId, asset.folder].join('/'), asset.name).then((result) => ({
						status: 200,
						header: {
							'Content-Type': mime.getType(extname(asset.name)),
							ETag: result.ETag
						},
						body: result.Body
				  }))
				: {
						status: 404
				  }
		)
		.catch(() => ({
			status: 404
		}));
}

export function getAssetById(client: PrismaClient, id: string) {
	return client.asset.findUnique({ where: { id } });
}
