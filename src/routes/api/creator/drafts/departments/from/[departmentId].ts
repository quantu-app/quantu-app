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
	creatorId: string
) {
	const department = await client.department.findUnique({
		where: {
			id: departmentId
		}
	});
	return client.departmentDraft.create({
		data: {
			creatorId,
			departmentRefId: department.id,
			name: department.name,
			url: department.url,
			logoId: department.logoId,
			description: department.description
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
