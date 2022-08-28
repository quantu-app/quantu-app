import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import { isEmpty } from '$lib/utils';
import type { PrismaClient, ChangeType, Change, Prisma } from '@prisma/client';

export const GET = isCreator(async (event) => {
	const latestString = event.url.searchParams.get('latest');
	const latest = latestString === 'true' ? true : latestString === 'false' ? false : undefined;
	const mergedString = event.url.searchParams.get('merged');
	const merged = mergedString === 'true' ? true : mergedString === 'false' ? false : undefined;
	return {
		body: await run((client) =>
			getChanges(
				client,
				event.url.searchParams.get('referenceType') as ChangeType,
				event.url.searchParams.get('referenceId'),
				event.url.searchParams.has('currentUser') ? event.locals.token?.userId : undefined,
				latest,
				merged
			)
		),
		status: 200
	};
});

export async function getChanges(
	client: PrismaClient,
	referenceType: ChangeType,
	referenceId: string | null | undefined,
	userId?: string,
	latest?: boolean,
	merged?: boolean
) {
	if (merged != null) {
		return client.mergeRequest
			.findMany({
				where: {
					change: {
						referenceType,
						referenceId,
						userId,
						latest
					},
					merged
				},
				select: {
					change: {
						include: {
							user: {
								select: {
									id: true,
									username: true
								}
							}
						}
					}
				}
			})
			.then((mergeRequests) => mergeRequests.map((mergeRequest) => mergeRequest.change));
	} else {
		return client.change.findMany({
			where: {
				referenceType,
				referenceId,
				userId,
				latest
			},
			include: {
				user: {
					select: {
						id: true,
						username: true
					}
				}
			}
		});
	}
}

export const POST = isCreator(async (event) => ({
	body: await run(async (client) => {
		const body = await event.request.json();
		return createChange(
			client,
			event.url.searchParams.get('referenceType') as ChangeType,
			event.url.searchParams.get('referenceId'),
			event.locals.token?.userId,
			body.name,
			body.value
		);
	}),
	status: 201
}));

export async function createChange(
	client: PrismaClient,
	referenceType: ChangeType,
	referenceId: string | null,
	userId: string,
	name: string,
	value: Prisma.InputJsonObject
) {
	referenceId = referenceId === '' ? null : referenceId;
	const mergeRequest = await client.mergeRequest.findFirst({
		where: {
			change: {
				referenceType,
				referenceId,
				latest: true
			}
		},
		select: {
			merged: true,
			change: {
				include: {
					user: {
						select: {
							id: true,
							username: true
						}
					}
				}
			}
		}
	});

	const runCreate = (prevChange?: Change) =>
		client.change.create({
			data: {
				name,
				value,
				referenceType,
				referenceId,
				prevChange: prevChange
					? {
							connect: {
								id: prevChange.id
							}
					  }
					: undefined,
				latest: true,
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				user: {
					select: {
						id: true,
						username: true
					}
				}
			}
		});

	if (mergeRequest) {
		if (mergeRequest.merged === true) {
			const [_prevChange, change] = await run([
				client.change.update({
					where: {
						id: mergeRequest.change.id
					},
					data: {
						latest: false
					}
				}),
				runCreate(mergeRequest.change)
			]);
			return change;
		} else {
			if (mergeRequest.change.userId === userId) {
				return client.change.update({
					where: {
						id: mergeRequest.change.id
					},
					data: {
						value: isEmpty(value) ? undefined : value
					},
					include: {
						user: {
							select: {
								id: true,
								username: true
							}
						}
					}
				});
			} else {
				return mergeRequest.change;
			}
		}
	} else {
		return runCreate();
	}
}
