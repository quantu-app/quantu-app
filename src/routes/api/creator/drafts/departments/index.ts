import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const get = isCreator(async () => {
	return {
		body: await run(getDepartmentDrafts),
		status: 200
	};
});

export function getDepartmentDrafts(client: PrismaClient) {
	return client.departmentDraft.findMany({
		include: {
			approvals: true,
			user: {
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
					url: true,
					description: true,
					logoId: true
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
			user: {
				connect: {
					id: userId
				}
			}
		},
		include: {
			approvals: true,
			user: {
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
					url: true,
					description: true,
					logoId: true
				}
			}
		}
	});
}
