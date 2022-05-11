import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';
import { createNestedIncludeRecur } from '../';

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
	return await client.comment.findFirst({
		where: {
			referenceType,
			referenceId,
			id: commentId
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

export const patch = authenticated(async (event) => ({
	body: await run(async (client) =>
		updateComment(
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
