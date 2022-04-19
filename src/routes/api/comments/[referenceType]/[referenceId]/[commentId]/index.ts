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
			commentVotes: true,
			comments: createNestedIncludeRecur(depth)
		}
	});
}

function createNestedIncludeRecur(depth: number) {
	if (depth < 0) {
		return true;
	} else {
		return {
			include: {
				commentVotes: true,
				comments: createNestedIncludeRecur(depth - 1)
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
			commentVotes: true
		}
	});
}
