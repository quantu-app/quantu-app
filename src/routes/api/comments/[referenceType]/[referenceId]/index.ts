import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';

export const GET = authenticated(async (event) => ({
	body: await run((client) =>
		getCommentsByReferenceId(
			client,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			parseInt(event.url.searchParams.get('depth') || '2')
		)
	),
	status: 200
}));

export async function getCommentsByReferenceId(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string | string[],
	depth = 2
) {
	const where = {
		referenceType,
		commentId: null
	} as any;
	if (Array.isArray(referenceId)) {
		where.referenceId = { in: referenceId };
	} else {
		where.referenceId = referenceId;
	}
	const comments = await client.comment.findMany({
		where,
		include: {
			comments: createNestedIncludeRecur(depth),
			votes: true,
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});

	return comments;
}

export function createNestedIncludeRecur(depth: number) {
	if (depth <= 0) {
		return {
			include: {
				votes: true,
				user: {
					select: {
						id: true,
						username: true
					}
				}
			}
		};
	} else {
		return {
			include: {
				comments: createNestedIncludeRecur(depth - 1),
				votes: true,
				user: {
					select: {
						id: true,
						username: true
					}
				}
			}
		};
	}
}

export const POST = authenticated(async (event) => ({
	body: await run(async (client) =>
		createComment(
			client,
			event.locals.token.userId,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			await event.request.json()
		)
	),
	status: 200
}));

export async function createComment(
	client: PrismaClient,
	userId: string,
	referenceType: CommentReferenceType,
	referenceId: string,
	data: any
) {
	const comment = await client.comment.create({
		data: {
			...data,
			commentId: data.commentId || null,
			userId,
			referenceType,
			referenceId: referenceId === '' ? null : referenceId
		},
		include: {
			comments: true,
			votes: true,
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});

	return comment;
}
