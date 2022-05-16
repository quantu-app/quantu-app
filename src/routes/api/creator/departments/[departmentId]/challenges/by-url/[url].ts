import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const departmentId = event.params.departmentId;
	const url = event.params.url;

	return run((client) =>
		client.challenge.findUnique({
			where: {
				departmentId_url: {
					departmentId,
					url
				}
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
		status: challenge ? 200 : 404
	}));
});
