import type { RequestEvent } from '@sveltejs/kit';
import { run } from 'svelte/internal';

export async function get(event: RequestEvent) {
	const url = event.params.url;
	const parentId = event.url.searchParams.get('parentId') || null;

	return run((client) =>
		client.topic.findUnique({
			where: {
				parentId_url: {
					url,
					parentId
				}
			}
		})
	).then((topic) => ({
		body: topic,
		status: 200
	}));
}
