import { authenticated } from '$lib/api/auth';
import { getPrimaryEmail } from '$lib/api/users/fromCallback';
import { run } from '$lib/prisma';
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
				return new Response(null, {
					status: 404
				});
			}
			const primaryEmail = getPrimaryEmail(user.emails);
			const primaryEmailHash = MD5.generate(primaryEmail);

			const userWithEmailHash = { ...user, emailHash: primaryEmailHash };

			return new Response(JSON.stringify(userWithEmailHash), { status: 200 });
		})
		.catch((error) => new Response(JSON.stringify(error), { status: 401 }));
});
