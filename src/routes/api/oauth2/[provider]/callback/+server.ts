import { encode } from '$lib/api/jwt';
import { fromCallback } from '$lib/api/users/fromCallback';
import { providers } from '$lib/oauth2';
import { run } from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const GET = async (event: RequestEvent) => {
	const provider = providers[event.params.provider];
	const url = new URL(event.request.url);
	const { profile, state } = await provider.callback(url);
	const names = 'name' in profile ? (profile as any)['name'].split(' ') : [];

	const user = await run((prisma) =>
		fromCallback(prisma, {
			isCreate: Boolean((state as any)['isCreate']),
			firstName: names[0],
			lastName: names[names.length - 1],
			email: profile.email,
			emailVerified: !!(profile as any)['email_verified']
		})
	);
	if (!user) {
		throw error(403);
	}
	const token = await encode({ userId: user.id });
	throw redirect(302, `/callback?token=${encodeURIComponent(token)}`);
};
