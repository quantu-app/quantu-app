import { extname } from 'path';
import mime from 'mime';
import { s3Get } from '$lib/s3';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { run } from '$lib/prisma';

export async function get(event: RequestEvent) {
	return run((client) => client.asset.findUnique({ where: { id: event.params.id } }))
		.then((asset) =>
			asset
				? s3Get([asset.departmentId, asset.folder].join('/'), asset.name).then((body) => {
						return {
							status: 200,
							header: {
								'Content-Type': mime.getType(extname(asset.name))
							},
							body
						};
				  })
				: {
						status: 404
				  }
		)
		.catch(() => {
			return {
				status: 404
			};
		});
}
