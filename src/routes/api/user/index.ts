import { authenticated } from '$lib/api/auth';
import { getPrimaryEmail } from '$lib/api/users/fromCallback';
import { run } from '$lib/prisma';
import type { StateUser } from '$lib/state/user';
import { MD5 } from 'md5-js-tools';

export const GET = authenticated((event) =>
	run((client) =>
		client.user.findUnique({
			where: {
				id: event.locals.token?.userId
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
	).then((user) => {
		if (user) {
			const privateUser = user as StateUser;
			const email = getPrimaryEmail(privateUser.emails);
			if (email) {
				privateUser.emailHash = MD5.generate(email);
			}
			return {
				status: 200,
				body: privateUser
			};
		} else {
			return { status: 404 };
		}
	})
);

export const PATCH = authenticated((event) =>
	event.request.json().then((data) =>
		run((client) =>
			client.user.update({
				data,
				where: {
					id: event.locals.token?.userId
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
		).then((user) => {
			if (user) {
				const privateUser = user as StateUser;
				const email = getPrimaryEmail(privateUser.emails);
				if (email) {
					privateUser.emailHash = MD5.generate(email);
				}
				return {
					status: 200,
					body: privateUser
				};
			} else {
				return { status: 404 };
			}
		})
	)
);
