import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const parentId = event.url.searchParams.get('parentId');

	return run((client) =>
		client.topic.findMany({
			where: {
				parentId: parentId || null
			}
		})
	).then((topics) => ({
		body: topics,
		status: 200
	}));
}
