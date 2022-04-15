import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
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
});

export const patch = isCreator(async (event) => {
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
});

export const del = isCreator((event) => {
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
});
