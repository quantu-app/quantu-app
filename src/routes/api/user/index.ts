import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = authenticated((event) =>
	run((client) =>
		client.user.findUnique({
			where: {
				id: event.locals.token.userId
			},
			select: {
				id: true,
				username: true,
				creator: true,
				active: true,
				emails: true,
				confirmed: true,
				firstName: true,
				lastName: true,
				birthday: true,
				country: true,
				bio: true,
				createdAt: true,
				updatedAt: true,
				settings: true
			}
		})
	).then((user) =>
		user
			? {
					status: 200,
					body: user
			  }
			: { status: 404 }
	)
);

export const PATCH = authenticated((event) =>
	event.request.json().then((data) =>
		run((client) =>
			client.user.update({
				data,
				where: {
					id: event.locals.token.userId
				},
				select: {
					id: true,
					username: true,
					creator: true,
					active: true,
					emails: true,
					confirmed: true,
					firstName: true,
					lastName: true,
					birthday: true,
					country: true,
					bio: true,
					createdAt: true,
					updatedAt: true,
					settings: true
				}
			})
		).then((user) =>
			user
				? {
						status: 200,
						body: user
				  }
				: { status: 404 }
		)
	)
);
