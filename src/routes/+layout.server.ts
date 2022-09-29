import { run } from '$lib/prisma';
import { currentUserWritable, type StateUser } from '$lib/state/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.token
		? await run((client) =>
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
						updatedAt: true
					}
				})
		  )
		: null;

	currentUserWritable.set(user as StateUser);

	return {
		user: user as StateUser
	};
};
