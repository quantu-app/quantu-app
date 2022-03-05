import { decode } from '$lib/api/jwt';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const departmentId = event.params.departmentId;

	return run((client) =>
		client.department.findUnique({
			where: {
				id: departmentId
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
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.department.update({
			where: {
				id: departmentId
			},
			data
		})
	).then((department) => ({
		body: department,
		status: 200
	}));
}

export async function del(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const departmentId = event.params.departmentId;

	return run((client) =>
		client.department.delete({
			where: {
				id: departmentId
			}
		})
	).then(() => ({
		status: 204
	}));
}
