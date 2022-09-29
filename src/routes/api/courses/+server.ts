import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getDepartments } from '../departments/+server';
import { getCourses } from '../departments/[departmentUrl]/courses/+server';

export const GET = authenticated(async (event) => {
	const courses = await run((client) =>
		getTopCourses(client, event.locals.token?.userId as string)
	);
	return new Response(JSON.stringify(courses), {
		status: 200
	});
});

export async function getTopCourses(client: PrismaClient, userId: string, size = 4) {
	const departments = await getDepartments(client);
	const challengesByDepartment = await Promise.all(
		departments.map((department) => getCourses(client, userId, 0, size, department.url))
	);
	return challengesByDepartment.flat(1);
}
