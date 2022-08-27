import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import { getPrimaryEmail, type PublicUser } from '$lib/state/user';
import { MD5 } from 'md5-js-tools';

export const GET = authenticated((event) => {
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
				emails: true,
				bio: true,
				country: true,
				createdAt: true
			}
		})
	)
		.then((user) => {
			if (!user) {
				return { status: 404 }
			}
			const primaryEmail = getPrimaryEmail(user.emails);
			const primaryEmailHash = MD5.generate(primaryEmail);

			const userWithEmailHash = { ...user, emailHash: primaryEmailHash };

			return {
				status: 200,
				body: userWithEmailHash
			};
		})
		.catch((error) => ({
			status: 401,
			body: error
		}));
});
