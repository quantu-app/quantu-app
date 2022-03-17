import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = authenticated((event) =>
	run((client) =>
		client.user.findUnique({
			where: {
				id: event.locals.token.userId
			},
			include: {
				emails: true
			}
		})
	).then((user) => {
		if (!user) {
			throw new Error('User not found');
		} else {
			return {
				status: 200,
				body: user
			};
		}
	})
);

export const patch = authenticated((event) =>
	event.request.json().then((data) =>
		run((client) =>
			client.user.update({
				data,
				where: {
					id: event.locals.token.userId
				},
				include: {
					emails: true
				}
			})
		).then((user) => {
			if (!user) {
				throw new Error('User not found');
			} else {
				return {
					status: 200,
					body: user
				};
			}
		})
	)
);
