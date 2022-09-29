import { redirect, type Load } from '@sveltejs/kit';

export const creatorGuard: Load = async ({ parent }) => {
	const { user } = await parent();
	if (!user?.creator) {
		throw redirect(302, '/');
	}
};
