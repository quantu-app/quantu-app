import type { LoadOutput } from '@sveltejs/kit';

export function creatorGuard({ session }): LoadOutput {
	if (session?.user?.creator) {
		return {};
	} else {
		return {
			status: 302,
			redirect: '/'
		};
	}
}
