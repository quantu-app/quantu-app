import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, ChangeType, Change, Prisma } from '@prisma/client';

export const get = isCreator(async (event) => {
	const ids = event.url.searchParams.getAll('ids');
	const latestString = event.url.searchParams.get('latest');
	const latest = latestString === 'true' ? true : latestString === 'false' ? false : undefined;
	const mergedString = event.url.searchParams.get('merged');
	const merged = mergedString === 'true' ? true : mergedString === 'false' ? false : undefined;
	return {
		body: await run((client) =>
			ids.length
				? getChangesByIds(client, ids)
				: getChanges(
						client,
						event.url.searchParams.get('referenceType') as ChangeType,
						event.url.searchParams.get('referenceId') || null,
						event.url.searchParams.has('currentUser') ? event.locals.token.userId : undefined,
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
	referenceId: string | null,
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

export function getChangesByIds(client: PrismaClient, ids: string[]) {
	return client.change.findMany({
		where: {
			id: { in: ids }
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

export const post = isCreator(async (event) => ({
	body: await run(async (client) =>
		createChange(
			client,
			event.url.searchParams.get('referenceType') as ChangeType,
			event.url.searchParams.get('referenceId') || null,
			event.locals.token.userId,
			await event.request.json()
		)
	),
	status: 201
}));

export async function createChange(
	client: PrismaClient,
	referenceType: ChangeType,
	referenceId: string | null,
	userId: string,
	value: Prisma.InputJsonObject
) {
	const prevChange = await client.change.findFirst({
		where: {
			referenceType,
			referenceId,
			latest: true
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
	const runCreate = (prevChange?: Change) =>
		client.change.create({
			data: {
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

	if (prevChange) {
		if (prevChange.latest) {
			const [_prevChange, change] = await client.$transaction([
				client.change.update({
					where: {
						id: prevChange.id
					},
					data: {
						latest: false
					}
				}),
				runCreate(prevChange)
			]);

			return change;
		} else {
			throw new Error('Cannot create a new change for a non-latest change');
		}
	} else {
		return runCreate();
	}
}
