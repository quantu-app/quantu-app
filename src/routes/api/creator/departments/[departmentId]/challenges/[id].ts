import { decode } from '$lib/api/jwt';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const id = event.params.id;

	return run((client) =>
		client.challenge.findFirst({
			where: {
				id
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((department) => ({
		body: department,
		status: 200
	}));
}

export async function patch(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const data = await event.request.json();
	const id = event.params.id;

	return run((client) =>
		client.challenge.update({
			where: {
				id
			},
			data,
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((department) => ({
		body: department,
		status: 200
	}));
}

export async function del(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const id = event.params.id;

	return run((client) =>
		client.challenge.delete({
			where: {
				id
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then(() => ({
		status: 204
	}));
}
