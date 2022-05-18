import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const get = isCreator(async () => ({
	body: await run(getDepartments),
	status: 200
}));

export function getDepartments(client: PrismaClient) {
	return client.department.findMany({
		include: {
			logo: {
				select: {
					name: true
				}
			}
		}
	});
}

export const post = isCreator(async (event) => ({
	body: await run(async (client) => createDepartment(client, await event.request.json())),
	status: 201
}));

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
