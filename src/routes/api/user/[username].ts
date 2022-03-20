import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = authenticated((event) => {
	const username = event.params.username;

	return run((client) =>
		client.user.findUnique({
			where: {
				username: username
			},
			select: {
				id: true,
				username: true,
				firstName: true,
				lastName: true,
				bio: true,
				country: true,
				createdAt: true
			}
		})
	)
		.then((user) =>
			user
				? {
						status: 200,
						body: user
				  }
				: { status: 404 }
		)
		.catch((error) => ({
			status: 401,
			body: error
		}));
});
