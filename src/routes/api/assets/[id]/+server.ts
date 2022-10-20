import { extname } from 'path';
import mime from 'mime';
import { Readable } from 'stream';
import { s3Get } from '$lib/s3';
import type { RequestEvent } from '@sveltejs/kit';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;

export const GET = async (event: RequestEvent) => {
	return run((client) => getAssetById(client, event.params.id as string))
		.then((asset) =>
			asset
				? s3Get([asset.departmentId, asset.folder].join('/'), asset.name).then((result) => {
						const maxage = result.Expires
							? Math.round(result.Expires.getTime() - Date.now() / 1000)
							: ONE_MONTH_IN_SECONDS;
						const headers: HeadersInit = {
							'Content-Type': mime.getType(extname(asset.name)) as string,
							'Cache-Control': `public, max-age=${maxage}`
						};
						if (result.ContentLength !== undefined) {
							headers['Content-Length'] = result.ContentLength + '';
						}
						if (result.ETag) {
							headers['ETag'] = result.ETag;
						}
						return new Response(Readable.toWeb(result.Body as Readable), {
							status: 200,
							headers
						});
				  })
				: {
						status: 404
				  }
		)
		.catch((error) => {
			console.error(error);
			return new Response(null, { status: 404 });
		});
};

export function getAssetById(client: PrismaClient, id: string) {
	return client.asset.findUnique({ where: { id } });
}
