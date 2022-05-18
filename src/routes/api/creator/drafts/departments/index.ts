import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const get = isCreator(async (event) => {
	const mergedString = event.url.searchParams.get('merged');
	const merged = mergedString === 'true' ? true : mergedString === 'false' ? false : null;
	return {
		body: await run((client) => getDepartmentDrafts(client, merged)),
		status: 200
	};
});

export function getDepartmentDrafts(client: PrismaClient, merged: boolean | null) {
	const where: any = {};
	if (merged !== null) {
		where.merged = merged;
	}
	return client.departmentDraft.findMany({
		where,
		include: {
			creator: {
				select: {
					id: true,
					username: true
				}
			},
			logo: {
				select: {
					name: true
				}
			},
			departmentRef: {
				select: {
					id: true,
					name: true,
					url: true
				}
			}
		}
	});
}

export const post = isCreator(async (event) => ({
	body: await run(async (client) =>
		createDepartmentDraft(client, event.locals.token.userId, await event.request.json())
	),
	status: 201
}));

export async function createDepartmentDraft(client: PrismaClient, userId: string, data: any) {
	const departmentRef = await client.department.findUnique({
		where: {
			url: data.url
		}
	});
	if (departmentRef) {
		throw new Error(`Department with url ${data.url} already exists, make a draft instead`);
	}
	return client.departmentDraft.create({
		data: {
			...data,
			creator: {
				connect: {
					id: userId
				}
			}
		},
		include: {
			creator: {
				select: {
					id: true,
					username: true
				}
			},
			logo: {
				select: {
					name: true
				}
			},
			departmentRef: {
				select: {
					id: true,
					name: true,
					url: true
				}
			}
		}
	});
}
