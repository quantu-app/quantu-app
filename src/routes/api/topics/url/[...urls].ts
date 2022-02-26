import { run } from '$lib/prisma';
import type { PrismaClient, Topic } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function getTopicsByUrl(client: PrismaClient, urlParts: string[]): Promise<Topic[]> {
	let parentId: string = null;
	const topics: Topic[] = [];
	for (const url of urlParts) {
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
}

export async function get(event: RequestEvent) {
	const urls: string[] = event.params.urls.split('/');

	return run(async (client) => getTopicsByUrl(client, urls)).then((topics) => ({
		body: topics,
		status: 200
	}));
}
