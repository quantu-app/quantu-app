import { extname } from 'path';
import mime from 'mime';
import { isCreator } from '$lib/api/auth';
import { s3Upload, s3Delete } from '$lib/s3';
import { run } from '$lib/prisma';
import type { AssetType } from '@prisma/client';
import { listAssets } from '../+server';

const ONE_GIBIBYTE = 1024 * 1024 * 1024;

export const GET = isCreator(async (event) => {
	const departmentId = event.params.departmentId as string;
	const folder = event.params.folder as string;
	const type = event.url.searchParams.get('type');

	return run((client) =>
		listAssets(client, departmentId, folder, type?.toUpperCase() as AssetType)
	).then((assets) => new Response(JSON.stringify(assets), { status: 200 }));
});

export const POST = isCreator(async (event) => {
	const departmentId = event.params.departmentId as string;
	const path = (event.params.folder as string).split('/');
	const name = path.pop() as string;
	const ext = extname(name);

	if (!ext) {
		return new Response(
			JSON.stringify({
				error: `Undefined file ext`
			}),
			{
				status: 400
			}
		);
	}

	const contentType = mime.getType(ext) || '';
	let type: AssetType;
	if (contentType.startsWith('image/')) {
		type = 'IMAGE';
	} else if (contentType.startsWith('video/')) {
		type = 'VIDEO';
	} else if (contentType.startsWith('audio/')) {
		type = 'AUDIO';
	} else {
		return new Response(
			JSON.stringify({
				error: `Unsupported file type: ${contentType}`
			}),
			{
				status: 400
			}
		);
	}

	const arrayBuffer = await event.request.arrayBuffer();

	if (arrayBuffer.byteLength === 0) {
		return new Response(
			JSON.stringify({
				error: `File is empty`
			}),
			{
				status: 400
			}
		);
	} else if (arrayBuffer.byteLength > ONE_GIBIBYTE) {
		return new Response(
			JSON.stringify({
				error: `File is too large`
			}),
			{
				status: 400
			}
		);
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
		).then((department) => new Response(JSON.stringify(department), { status: 200 }))
	);
});

export const DELETE = isCreator(async (event) => {
	const departmentId = event.params.departmentId as string;
	const path = (event.params.folder as string).split('/');
	const name = path.pop() as string;

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
		.then(
			(asset) =>
				new Response(JSON.stringify(asset), {
					status: 200
				})
		);
});
