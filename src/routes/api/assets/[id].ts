import { extname } from 'path';
import mime from 'mime';
import { Readable } from 'stream';
import { s3Get } from '$lib/s3';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;

export const GET = async (event: RequestEvent) => {
	return run((client) => getAssetById(client, event.params.id))
		.then((asset) =>
			asset
				? s3Get([asset.departmentId, asset.folder].join('/'), asset.name).then((result) => {
						const maxage = result.Expires
							? Math.round(result.Expires.getTime() - Date.now() / 1000)
							: ONE_MONTH_IN_SECONDS;
						const header = {
							'Content-Type': mime.getType(extname(asset.name)),
							'Content-Length': result.ContentLength,
							'Cache-Control': `public, max-age=${maxage}`
						};
						if (result.ETag) {
							header['ETag'] = result.ETag;
						}
						return {
							status: 200,
							header,
							maxage,
							body: Readable.toWeb(result.Body as Readable)
						};
				  })
				: {
						status: 404
				  }
		)
		.catch(() => ({
			status: 404
		}));
};

export function getAssetById(client: PrismaClient, id: string) {
	return client.asset.findUnique({ where: { id } });
}
