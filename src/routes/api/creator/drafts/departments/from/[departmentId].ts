import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const post = isCreator(async (event) => ({
	body: await run(async (client) =>
		createDepartmentDraft(client, event.params.departmentId, event.locals.token.userId)
	),
	status: 201
}));

export async function createDepartmentDraft(
	client: PrismaClient,
	departmentId: string,
	userId: string
) {
	const department = await client.department.findUnique({
		where: {
			id: departmentId
		}
	});
	return client.departmentDraft.create({
		data: {
			userId,
			departmentRefId: department.id
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
