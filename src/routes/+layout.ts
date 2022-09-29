import type { LayoutLoad } from './$types';
import '../app.scss';
import { currentUserWritable } from '$lib/state/user';

export const load: LayoutLoad = async (event) => {
	currentUserWritable.set(event.data.user);
};
