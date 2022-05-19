import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, ChangeType, Prisma } from '@prisma/client';

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
	const { id: prevChangeId } = await client.change.findFirst({
		where: {
			referenceType,
			referenceId,
			userId,
			latest: true
		},
		select: {
			id: true
		}
	});

	const runCreate = () =>
		client.change.create({
			data: {
				value,
				referenceType,
				referenceId,
				prevChange: {
					connect: {
						id: prevChangeId
					}
				},
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

	if (prevChangeId) {
		const [_prevChange, change] = await client.$transaction([
			client.change.update({
				where: {
					id: prevChangeId
				},
				data: {
					latest: false
				}
			}),
			runCreate()
		]);

		return change;
	} else {
		return runCreate();
	}
}
