import type { RequestEvent } from '@sveltejs/kit';
import { run } from 'svelte/internal';

export async function get(event: RequestEvent) {
	const parentId = event.url.searchParams.get('parentId');

	return run((client) =>
		client.topic.findMany({
			where: {
				parentId: parentId
			}
		})
	).then((topics) => ({
		body: topics,
		status: 200
	}));
}

export async function post(event: RequestEvent) {
	const data = await event.request.json();

	return run((client) =>
		client.topic.create({
			data
		})
	)
		.then((topic) => ({
			body: topic,
			status: 201
		}))
		.then((error) => ({
			body: error,
			status: 500
		}));
}
