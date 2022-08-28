import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getDepartments } from '../departments';
import { getCourses } from '../departments/[departmentUrl]/courses';

export const GET = authenticated(async (event) => ({
	body: await run((client) => getTopCourses(client, event.locals.token?.userId)),
	status: 200
}));

export async function getTopCourses(client: PrismaClient, userId: string, size = 4) {
	const departments = await getDepartments(client);
	const challengesByDepartment = await Promise.all(
		departments.map((department) => getCourses(client, userId, 0, size, department.url))
	);
	return challengesByDepartment.flat(1);
}
