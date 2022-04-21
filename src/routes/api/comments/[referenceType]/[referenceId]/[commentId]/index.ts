import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';

export const get = authenticated(async (event) => ({
	body: await run((client) =>
		getCommentById(
			client,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			event.params.commentId,
			parseInt(event.url.searchParams.get('depth') || '3')
		)
	),
	status: 200
}));

export async function getCommentById(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	commentId: string,
	depth = 3
) {
	return await client.comment.findUnique({
		where: {
			referenceType_referenceId_commentId: {
				referenceType,
				referenceId,
				commentId
			}
		},
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
}

function createNestedIncludeRecur(depth: number) {
	if (depth < 0) {
		return true;
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

export const patch = authenticated(async (event) => ({
	body: await run(async (client) =>
		getCommentById(
			client,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			event.params.commentId,
			await event.request.json()
		)
	),
	status: 200
}));

export async function updateComment(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	commentId: string,
	data: any
) {
	return await client.comment.update({
		data: {
			...data,
			referenceType,
			referenceId
		},
		where: {
			referenceType_referenceId_commentId: {
				referenceType,
				referenceId,
				commentId
			}
		},
		include: {
			votes: true,
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});
}
