import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getDepartments } from '../departments/+server';
import { getChallenges } from '../departments/[departmentUrl]/challenges/+server';

export const GET = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run((client) => getTopChallenges(client, event.locals.token?.userId as string))
			),
			{
				status: 200
			}
		)
);

export async function getTopChallenges(client: PrismaClient, userId: string, size = 4) {
	const departments = await getDepartments(client);
	const challengesByDepartment = await Promise.all(
		departments.map((department) => getChallenges(client, userId, 0, size, department.url))
	);
	return challengesByDepartment.flat(1);
}
