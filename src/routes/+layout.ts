import type { LayoutLoad } from './$types';
import '../app.scss';
import { currentUserWritable, type StateUser } from '$lib/state/user';
import { get } from 'svelte/store';

export const load: LayoutLoad = async (event) => {
	const user = event.data.user || get(currentUserWritable);

	currentUserWritable.set(user as StateUser);

	return {
		user: user as StateUser
	};
};
