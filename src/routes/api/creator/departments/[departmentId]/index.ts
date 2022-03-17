import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = authenticated((event) => {
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
});

export const patch = authenticated(async (event) => {
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
});

export const del = authenticated((event) => {
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
});
