import type { Load } from '@sveltejs/kit';

export const creatorGuard: Load = ({ session }) => {
	if (session?.user?.creator) {
		return {};
	} else {
		return {
			status: 302,
			redirect: '/'
		};
	}
};
