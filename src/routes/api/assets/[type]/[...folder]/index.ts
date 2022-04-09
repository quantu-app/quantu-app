import { extname } from 'path';
import { getType } from 'mime';
import { listAssets, getAsset, uploadAsset } from '$lib/s3';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const type = event.params.type;
	const path = event.params.folder.split('/');
	const name = path.pop();

	if (name.includes('.')) {
		return {
			status: 200,
			header: {
				'Content-Type': getType(extname(name))
			},
			body: await getAsset(type, path.join('/'), name)
		};
	} else {
		return {
			status: 200,
			body: await listAssets(type, [...path, name].join('/'))
		};
	}
}

export async function post(event: RequestEvent) {
	const type = event.params.type;
	const path = event.params.folder.split('/');
	const name = path.pop();

	if (!name.includes('.')) {
		return {
			status: 400,
			body: {
				error: 'Invalid file name'
			}
		};
	} else {
		return {
			status: 201,
			body: await uploadAsset(type, path.join('/'), name, await event.request.arrayBuffer())
		};
	}
}
