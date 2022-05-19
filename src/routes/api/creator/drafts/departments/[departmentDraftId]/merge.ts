import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import { filterObjectByNullOrUndefined } from '$lib/utils';
import type { PrismaClient } from '@prisma/client';

export const patch = isCreator(async (event) =>
	run((client) => mergeDepartmentDraft(client, event.params.departmentDraftId)).then(
		(departmentAndDepartmentDraft) => ({
			body: departmentAndDepartmentDraft,
			status: departmentAndDepartmentDraft ? 200 : 400
		})
	)
);

export async function mergeDepartmentDraft(client: PrismaClient, departmentDraftId: string) {
	const { departmentRefId, ...departmentDraftChanges } = await client.departmentDraft.findUnique({
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

	const [department, departmentDraft] = await client.$transaction([
		departmentRefId
			? client.department.update({
					where: {
						id: departmentRefId
					},
					data: filterObjectByNullOrUndefined(departmentDraftChanges),
					include: {
						logo: {
							select: {
								name: true
							}
						}
					}
			  })
			: client.department.create({
					data: filterObjectByNullOrUndefined(departmentDraftChanges),
					include: {
						logo: {
							select: {
								name: true
							}
						}
					}
			  }),
		client.departmentDraft.update({
			where: {
				id: departmentDraftId
			},
			data: {
				mergedAt: new Date()
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
		})
	]);

	return { department, departmentDraft };
}
