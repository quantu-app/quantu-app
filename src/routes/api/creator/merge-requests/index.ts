import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, ChangeType, MergeRequest, Change, Department } from '@prisma/client';

export const get = isCreator(async (event) => {
	return {
		body: await run((client) =>
			getMergeRequests(
				client,
				event.url.searchParams.get('referenceType') as ChangeType,
				event.url.searchParams.has('currentUser') ? event.locals.token.userId : undefined
			)
		),
		status: 200
	};
});

export async function getMergeRequests(
	client: PrismaClient,
	referenceType?: ChangeType,
	userId?: string
) {
	const mergeReqeusts = await client.mergeRequest.findMany({
		where: {
			change: referenceType
				? {
						referenceType
				  }
				: undefined,
			userId
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
		mergeReqeusts.map((mergeRequest) => getReferenceType(client, mergeRequest))
	);
	const referencesByRequestId = references.reduce((referencesByRequestId, reference) => {
		referencesByRequestId[reference.mergeRequestId] = reference.reference;
		return referencesByRequestId;
	}, {} as { [id: string]: Department });

	return mergeReqeusts.map((mergeRequest) => {
		(mergeRequest as any).reference = referencesByRequestId[mergeRequest.id];
		return mergeRequest;
	});
}

export async function getReferenceType(
	client: PrismaClient,
	mergeRequest: MergeRequest & { change: { referenceType: string; referenceId: string } }
) {
	switch (mergeRequest.change.referenceType) {
		case 'DEPARTMENT':
			return {
				mergeRequestId: mergeRequest.id,
				reference: await client.department.findUnique({
					where: {
						id: mergeRequest.change.referenceId
					}
				})
			};
	}
}
