import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = isCreator((event) => {
	const departmentId = event.params.departmentId;

	return run((client) => getCourses(client, departmentId)).then((courses) => ({
		body: courses,
		status: 200
	}));
});

export const PUT = isCreator((event) => {
	const departmentId = event.params.departmentId;

	return run(async (client) => getCourses(client, departmentId, await event.request.json())).then(
		(courses) => ({
			body: courses,
			status: 200
		})
	);
});

export function getCourses(client: PrismaClient, departmentId: string, ids: string[] = []) {
	const where: any = { departmentId };
	if (ids.length) {
		where.id = {
			in: ids
		};
	}
	return client.course.findMany({
		where,
		include: {
			department: {
				select: {
					url: true,
					name: true
				}
			}
		}
	});
}

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.course.create({
			data: {
				...data,
				departmentId
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((course) => ({
		body: course,
		status: 201
	}));
});
