import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import { getChallenges } from '../departments/[departmentUrl]/challenges';

export const get = authenticated(async (event) => ({
	body: await run((client) => getChallenges(client, event.locals.token.userId)),
	status: 200
}));
