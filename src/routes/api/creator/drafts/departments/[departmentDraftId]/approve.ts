import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const patch = isCreator(async (event) =>
	run((client) =>
		approveDepartmentDraft(client, event.params.departmentDraftId, event.locals.token.userId)
	).then((departmentDraft) => ({
		body: departmentDraft,
		status: departmentDraft ? 200 : 400
	}))
);

export function approveDepartmentDraft(
	client: PrismaClient,
	departmentDraftId: string,
	userId: string
) {
	return client.departmentDraftApproval.upsert({
		where: {
			departmentDraftId_userId: {
				userId,
				departmentDraftId
			}
		},
		create: {
			userId,
			departmentDraftId
		},
		update: {
			userId,
			departmentDraftId
		}
	});
}
