import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, ChangeType, Change, Prisma } from '@prisma/client';

export const get = isCreator(async (event) => {
	return {
		body: await run((client) =>
			getChanges(
				client,
				event.url.searchParams.get('referenceType') as ChangeType,
				event.url.searchParams.get('referenceId') || null,
				event.url.searchParams.has('currentUser') ? event.locals.token.userId : undefined,
				event.url.searchParams.has('latest') ? true : undefined
			)
		),
		status: 200
	};
});

export function getChanges(
	client: PrismaClient,
	referenceType: ChangeType,
	referenceId: string | null,
	userId?: string,
	latest?: boolean
) {
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
