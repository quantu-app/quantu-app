import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getReferenceType } from '..';

export const get = isCreator(async (event) => {
	return {
		body: await run((client) => getMergeRequests(client, event.params.mergeRequestId)),
		status: 200
	};
});

export async function getMergeRequests(client: PrismaClient, mergeRequestId: string) {
	const mergeRequest = await client.mergeRequest.findUnique({
		where: {
			id: mergeRequestId
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
	(mergeRequest as any).reference = getReferenceType(client, mergeRequest);
	return mergeRequest;
}
