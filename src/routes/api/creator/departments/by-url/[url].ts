import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const url = event.params.url;

	return run((client) =>
		client.department.findUnique({
			where: {
				url
			}
		})
	).then((department) => ({
		body: department,
		status: department ? 200 : 404
	}));
});
