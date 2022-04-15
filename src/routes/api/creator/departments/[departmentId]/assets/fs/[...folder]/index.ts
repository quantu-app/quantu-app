import { extname } from 'path';
import mime from 'mime';
import { isCreator } from '$lib/api/auth';
import { s3Upload, s3Delete } from '$lib/s3';
import { run } from '$lib/prisma';
import type { AssetType } from '@prisma/client';
import { listAssets } from '..';

const ONE_GIBIBYTE = 1024 * 1024 * 1024;

export const get = isCreator(async (event) => {
	const departmentId = event.params.departmentId;
	const folder = event.params.folder;
	const type = event.url.searchParams.get('type');

	return run((client) =>
		listAssets(client, departmentId, folder, type?.toUpperCase() as AssetType)
	).then((assets) => ({
		body: assets,
		status: 200
	}));
});

export const post = isCreator(async (event) => {
	const departmentId = event.params.departmentId;
	const path = event.params.folder.split('/');
	const name = path.pop();
	const ext = extname(name);

	if (!ext) {
		return {
			status: 400,
			body: {
				error: `Undefined file ext`
			}
		};
	}

	const contentType = mime.getType(ext);
	let type: AssetType;
	if (contentType.startsWith('image/')) {
		type = 'IMAGE';
	} else if (contentType.startsWith('video/')) {
		type = 'VIDEO';
	} else if (contentType.startsWith('audio/')) {
		type = 'AUDIO';
	} else {
		return {
			status: 400,
			body: {
				error: `Unsupported file type: ${contentType}`
			}
		};
	}

	const arrayBuffer = await event.request.arrayBuffer();

	if (arrayBuffer.byteLength === 0) {
		return {
			status: 400,
			body: {
				error: `File is empty`
			}
		};
	} else if (arrayBuffer.byteLength > ONE_GIBIBYTE) {
		return {
			status: 400,
			body: {
				error: `File is too large`
			}
		};
	}

	return s3Upload([departmentId, ...path].join('/'), name, arrayBuffer).then(() =>
		run((client) =>
			client.asset.upsert({
				where: {
					departmentId_folder_name: {
						departmentId,
						name,
						folder: path.join('/')
					}
				},
				create: {
					departmentId,
					name,
					type,
					folder: path.join('/')
				},
				update: { name }
			})
		).then((department) => ({
			body: department,
			status: 200
		}))
	);
});

export const del = isCreator(async (event) => {
	const departmentId = event.params.departmentId;
	const path = event.params.folder.split('/');
	const name = path.pop();

	return s3Delete([departmentId, ...path].join('/'), name)
		.then(() =>
			run((client) =>
				client.asset.delete({
					where: {
						departmentId_folder_name: {
							departmentId,
							name,
							folder: path.join('/')
						}
					}
				})
			)
		)
		.then((asset) => ({
			status: 200,
			body: asset
		}));
});
