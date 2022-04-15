import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.challenge.findMany({
			where: {
				departmentId
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
	).then((challenges) => ({
		body: challenges,
		status: 200
	}));
});

export const post = isCreator(async (event) => {
	const data = await event.request.json();
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.challenge.create({
			data: {
				...data,
				departmentId
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
	).then((challenge) => ({
		body: challenge,
		status: 201
	}));
});
