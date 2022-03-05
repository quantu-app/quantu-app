import { encode } from '$lib/api/jwt';
import { fromCallback } from '$lib/api/users/fromCallback';
import { providers } from '$lib/oauth2';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function get(event: RequestEvent) {
	const provider = providers[event.params.provider];
	const url = new URL(event.request.url);
	const { profile, state } = await provider.callback(url);
	const names = profile['name'] ? profile['name'].split(' ') : [];

	const user = await run((prisma) =>
		fromCallback(prisma, {
			isCreate: Boolean(state['isCreate']),
			firstName: names[0],
			lastName: names[names.length - 1],
			email: profile.email,
			emailVerified: !!profile['email_verified']
		})
	);
	const token = await encode({ userId: user.id });

	return {
		headers: {
			'Set-Cookie': `token=${token}; path=/; expires=${new Date(
				Date.now() + 1000 * 60 * 60 * 24 * 365
			).toUTCString()}`,
			Location: state['redirect'] || '/'
		},
		status: 302
	};
}
