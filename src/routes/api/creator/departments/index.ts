import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator(() =>
	run((client) => client.department.findMany()).then((departments) => ({
		body: departments,
		status: 200
	}))
);

export const post = isCreator(async (event) => {
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
