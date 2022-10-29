import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, MergeRequest, Change, Prisma, Department } from '@prisma/client';
import { json } from '@sveltejs/kit';

export const POST = isCreator(async (event) => {
	return json(
		await run((client) => mergeMergeRequest(client, event.params.mergeRequestId as string)),
		{
			status: 200
		}
	);
});

export function mergeMergeRequest(client: PrismaClient, mergeRequestId: string) {
	return run(async (client) => {
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
		const reference = await upsertReference(client, mergeRequest);
		await client.change.update({
			where: { id: mergeRequest.change.id },
			data: { referenceId: reference.id }
		});
		(mergeRequest as any).reference = reference;
		return mergeRequest;
	});
}

function upsertReference(
	client: Prisma.TransactionClient,
	mergeRequest: MergeRequest & { change: Change }
): Promise<Department> {
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
	return null as any;
}
