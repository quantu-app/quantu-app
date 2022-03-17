import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = authenticated(() =>
	run((client) => client.department.findMany()).then((departments) => ({
		body: departments,
		status: 200
	}))
);

export const post = authenticated(async (event) => {
	const data = await event.request.json();

	return run((client) =>
		client.department.create({
			data
		})
	).then((department) => ({
		body: department,
		status: 201
	}));
});
