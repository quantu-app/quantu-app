import type { RequestEvent } from '@sveltejs/kit';
import { run } from '$lib/prisma';

export async function get(event: RequestEvent) {
	const id = event.params.id;

	return run((client) =>
		client.topic.findUnique({
			where: {
				id
			}
		})
	).then((topic) => ({
		body: topic,
		status: 200
	}));
}

export async function patch(event: RequestEvent) {
	const data = await event.request.json();
	const id = event.params.id;

	return run((client) =>
		client.topic.update({
			where: {
				id
			},
			data
		})
	).then((topic) => ({
		body: topic,
		status: 200
	}));
}

export async function del(event: RequestEvent) {
	const id = event.params.id;

	return run((client) =>
		client.topic.delete({
			where: {
				id
			}
		})
	).then(() => ({
		status: 204
	}));
}
