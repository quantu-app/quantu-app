import { redirect } from '@sveltejs/kit';

export const authGuard = async ({ parent, url }: any) => {
	const { user } = await parent();

	if (!user) {
		const redirectQuery = url.searchParams.toString(),
			redirectPath = url.pathname + (redirectQuery ? '?' + redirectQuery : '');

		let path = '/';

		if (redirectPath && url.pathname !== '/') {
			path += `?redirectPath=${encodeURIComponent(redirectPath)}`;
		}

		throw redirect(302, path);
	}
};
