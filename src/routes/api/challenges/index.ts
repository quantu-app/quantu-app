import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getChallenges } from '../departments/[departmentUrl]/challenges';
import { getDepartments } from '../departments';

export const GET = authenticated(async (event) => ({
	body: await run((client) => getTopChallenges(client, event.locals.token.userId)),
	status: 200
}));

export async function getTopChallenges(client: PrismaClient, userId: string, size = 4) {
	const departments = await getDepartments(client);
	const challengesByDepartment = await Promise.all(
		departments.map((department) => getChallenges(client, userId, 0, size, department.url))
	);
	return challengesByDepartment.flat(1);
}
