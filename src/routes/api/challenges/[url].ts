import type { RequestEvent } from '@sveltejs/kit';
import { run } from '$lib/prisma';

export async function get(event: RequestEvent) {
	const url = event.params.url;
	const topicId = event.url.searchParams.get('topicId') || null;

	return run((client) =>
		client.challenge.findFirst({
			where: {
				url,
				topicId
			}
		})
	).then((topic) => ({
		body: topic,
		status: 200
	}));
}
