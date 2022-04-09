import { listAssets } from '$lib/s3';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const type = event.params.type;

	return {
		status: 200,
		body: await listAssets(type)
	};
}
