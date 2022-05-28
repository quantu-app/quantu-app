import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getReferenceType } from '../../merge-requests';

export const get = isCreator(async (event) => {
	const mergeRequest = await run(async (client) =>
		getMergeRequestByChangeId(client, event.params.changeId)
	);
	return {
		body: mergeRequest,
		status: mergeRequest ? 200 : 404
	};
});

export async function getMergeRequestByChangeId(client: PrismaClient, changeId: string) {
	const mergeRequest = await client.mergeRequest.findFirst({
		where: {
			change: {
				id: changeId
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
			change: {
				select: {
					referenceId: true,
					referenceType: true
				}
			}
		}
	});
	if (mergeRequest) {
		(mergeRequest as any).reference = await getReferenceType(client, mergeRequest);
	}
	return mergeRequest;
}

export const post = isCreator(async (event) => ({
	body: await run(async (client) =>
		createMergeRequest(client, event.params.changeId, event.locals.token.userId)
	),
	status: 201
}));

export async function createMergeRequest(client: PrismaClient, changeId: string, userId: string) {
	const mergeRequest = await client.mergeRequest.create({
		data: {
			change: {
				connect: {
					id: changeId
				}
			},
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
			change: {
				select: {
					referenceId: true,
					referenceType: true
				}
			}
		}
	});
	if (mergeRequest) {
		(mergeRequest as any).reference = await getReferenceType(client, mergeRequest);
	}
	return mergeRequest;
}
