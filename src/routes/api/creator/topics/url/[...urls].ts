import type { RequestEvent } from '@sveltejs/kit';
import { run } from '$lib/prisma';
import type { Topic } from '@prisma/client';

export async function get(event: RequestEvent) {
	const urls: string[] = event.params.urls.split('/');

	return run(async (client) => {
		// TODO: make this a single query
		let parentId: string = null;
		const topics: Topic[] = [];
		for (const url of urls) {
			const topic =
				parentId === null
					? await client.topic.findUnique({
							where: {
								url: url
							}
					  })
					: await client.topic.findUnique({
							where: {
								parentId_url: { url, parentId }
							}
					  });
			if (topic) {
				parentId = topic.id;
				topics.push(topic);
			} else {
				break;
			}
		}
		return topics;
	}).then((topics) => ({
		body: topics,
		status: 200
	}));
}
