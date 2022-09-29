import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = isCreator(async (_event) => {
	const departments = await run((client) => getDepartments(client));
	return new Response(JSON.stringify(departments), { status: 200 });
});

export const PUT = isCreator(async (event) => {
	const department = await run(async (client) =>
		getDepartments(client, await event.request.json())
	);
	return new Response(JSON.stringify(department), { status: 200 });
});

export function getDepartments(client: PrismaClient, ids: string[] = []) {
	const where: any = {};
	if (ids.length) {
		where.id = {
			in: ids
		};
	}
	return client.department.findMany({
		where,
		include: {
			logo: {
				select: {
					name: true
				}
			}
		}
	});
}

export const POST = isCreator(async (event) => {
	const department = await run(async (client) =>
		createDepartment(client, await event.request.json())
	);
	return new Response(JSON.stringify(department), { status: 201 });
});

export function createDepartment(client: PrismaClient, data: any) {
	return client.department.create({
		include: {
			logo: {
				select: {
					name: true
				}
			}
		},
		data
	});
}
