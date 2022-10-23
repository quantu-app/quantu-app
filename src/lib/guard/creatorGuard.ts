import { redirect } from '@sveltejs/kit';

export const creatorGuard = async ({ parent }: any) => {
	const { user } = await parent();

	if (!user?.creator) {
		throw redirect(302, '/');
	}
};
