import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, ChangeType, MergeRequest, Department } from '@prisma/client';

export const get = isCreator(async (event) => {
	const mergedString = event.url.searchParams.get('merged');
	const merged = mergedString === 'true' ? true : mergedString === 'false' ? false : undefined;
	return {
		body: await run((client) =>
			getMergeRequests(
				client,
				event.url.searchParams.get('referenceType') as ChangeType,
				event.url.searchParams.has('currentUser') ? event.locals.token.userId : undefined,
				merged
			)
		),
		status: 200
	};
});

export async function getMergeRequests(
	client: PrismaClient,
	referenceType?: ChangeType,
	userId?: string,
	merged?: boolean
) {
	const mergeReqeusts = await client.mergeRequest.findMany({
		where: {
			change: referenceType
				? {
						referenceType
				  }
				: undefined,
			userId,
			merged
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
					value: true
				}
			}
		}
	});

	const references = await Promise.all(
		mergeReqeusts.map(async (mergeRequest) => ({
			mergeRequestId: mergeRequest.id,
			reference: await getReferenceType(client, mergeRequest)
		}))
	);
	const referencesByRequestId = references.reduce(
		(referencesByRequestId, { mergeRequestId, reference }) => {
			referencesByRequestId[mergeRequestId] = reference;
			return referencesByRequestId;
		},
		{} as { [id: string]: Department }
	);

	return mergeReqeusts.map((mergeRequest) => {
		(mergeRequest as any).reference = referencesByRequestId[mergeRequest.id];
		return mergeRequest;
	});
}

export async function getReferenceType(
	client: PrismaClient,
	mergeRequest: MergeRequest & { change: { referenceType: string; referenceId: string } }
) {
	if (!mergeRequest.change.referenceId) {
		return null;
	}
	switch (mergeRequest.change.referenceType) {
		case 'DEPARTMENT':
			return client.department.findUnique({
				where: {
					id: mergeRequest.change.referenceId
				}
			});
	}
}
