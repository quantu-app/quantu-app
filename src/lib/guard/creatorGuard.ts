import { redirect } from '@sveltejs/kit';

export const creatorGuard = async ({ locals }: any) => {
	const user = locals.user;
	if (!user?.creator) {
		throw redirect(302, '/');
	}
};
