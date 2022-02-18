import type { RequestEvent } from '@sveltejs/kit';
import { run } from 'svelte/internal';

export async function get(event: RequestEvent) {
	const url = event.params.url;
	const topicId = event.url.searchParams.get('topicId');

	return run((client) =>
		client.challenge.findUnique({
			where: {
				parentId_url: { url, topicId }
			}
		})
	).then((topic) => ({
		body: topic,
		status: 200
	}));
}
