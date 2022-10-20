import { currentUserWritable, type StateUser } from '$lib/state/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.user;

	currentUserWritable.set(user as StateUser);

	return {
		user: user as StateUser
	};
};
