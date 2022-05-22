import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, MergeRequest, Change } from '@prisma/client';

export const post = isCreator(async (event) => {
	return {
		body: await run((client) => mergeMergeRequest(client, event.params.mergeRequestId)),
		status: 200
	};
});

export async function mergeMergeRequest(client: PrismaClient, mergeRequestId: string) {
	const mergeRequest = await client.mergeRequest.update({
		where: {
			id: mergeRequestId
		},
		data: {
			merged: true
		},
		include: {
			approvals: true,
			user: {
				select: {
					id: true,
					username: true
				}
			},
			change: true
		}
	});
	(mergeRequest as any).reference = upsertReference(client, mergeRequest);
	return mergeRequest;
}

export async function upsertReference(
	client: PrismaClient,
	mergeRequest: MergeRequest & { change: Change }
) {
	switch (mergeRequest.change.referenceType) {
		case 'DEPARTMENT':
			return mergeRequest.change.referenceId
				? client.department.update({
						where: {
							id: mergeRequest.change.referenceId
						},
						data: mergeRequest.change.value as any
				  })
				: client.department.create({
						data: mergeRequest.change.value as any
				  });
	}
}
