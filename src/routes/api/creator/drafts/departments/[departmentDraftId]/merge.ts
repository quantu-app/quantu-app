import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const patch = isCreator(async (event) =>
	run((client) => mergeDepartmentDraft(client, event.params.departmentDraftId)).then(
		(departmentDraft) => ({
			body: departmentDraft,
			status: departmentDraft ? 200 : 400
		})
	)
);

export async function mergeDepartmentDraft(client: PrismaClient, departmentDraftId: string) {
	const { departmentRefId, ...departmentDraft } = await client.departmentDraft.findUnique({
		where: {
			id: departmentDraftId
		},
		select: {
			departmentRefId: true,
			name: true,
			url: true,
			logoId: true,
			description: true
		}
	});

	const department = departmentRefId
		? await client.department.update({
				where: {
					id: departmentRefId
				},
				data: departmentDraft,
				include: {
					logo: {
						select: {
							name: true
						}
					}
				}
		  })
		: await client.department.create({
				data: departmentDraft,
				include: {
					logo: {
						select: {
							name: true
						}
					}
				}
		  });

	await client.departmentDraft.update({
		where: {
			id: departmentDraftId
		},
		data: {
			merged: true
		}
	});

	return department;
}
