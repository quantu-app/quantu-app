import type { User } from '$lib/api/quantu-app-api';
import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from 'src/hooks';

export const del: RequestHandler<Locals, unknown, { ok: boolean }> = ({ locals }) => {
	locals.user = undefined;
	return { body: { ok: true } };
};

export const post: RequestHandler<Locals, User, { ok: boolean }> = ({ locals, body: user }) => {
	locals.user = user;
	return { body: { ok: true } };
};
