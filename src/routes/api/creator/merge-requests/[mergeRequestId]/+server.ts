import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { getReferenceType } from '../+server';

export const GET = isCreator(async (event) => {
	return new Response(
		JSON.stringify(
			await run((client) => getMergeRequest(client, event.params.mergeRequestId as string))
		),
		{
			status: 200
		}
	);
});

export async function getMergeRequest(client: PrismaClient, mergeRequestId: string) {
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
					referenceType: true,
					prevChangeId: true
				}
			}
		}
	});
	if (mergeRequest) {
		(mergeRequest as any).reference = await getReferenceType(client, mergeRequest);
	}
	return mergeRequest;
}
