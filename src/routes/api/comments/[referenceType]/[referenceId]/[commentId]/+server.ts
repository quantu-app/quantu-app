import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';
import { createNestedIncludeRecur } from '../+server';

export const GET = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run((client) =>
					getCommentById(
						client,
						event.params.referenceType as CommentReferenceType,
						event.params.referenceId as string,
						event.params.commentId as string,
						parseInt(event.url.searchParams.get('depth') || '2')
					)
				)
			),
			{
				status: 200
			}
		)
);

export async function getCommentById(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	commentId: string,
	depth = 2
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

export const PATCH = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run(async (client) =>
					updateComment(
						client,
						event.params.referenceType as CommentReferenceType,
						event.params.referenceId as string,
						event.params.commentId as string,
						event.locals.token?.userId as string,
						await event.request.json()
					)
				)
			),
			{
				status: 200
			}
		)
);

export async function updateComment(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	commentId: string,
	userId: string,
	data: any
) {
	const comment = await client.comment.findFirst({
		where: {
			referenceType,
			referenceId,
			id: commentId,
			userId
		},
		select: {
			id: true,
			commentId: true
		}
	});
	if (!comment) {
		return null;
	}
	return await client.comment.update({
		data: {
			...data,
			deleted: false,
			referenceType,
			referenceId,
			commentId: comment.commentId,
			userId
		},
		where: {
			id: comment.id
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

export const DELETE = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run(async (client) =>
					deleteComment(
						client,
						event.params.referenceType as CommentReferenceType,
						event.params.referenceId as string,
						event.params.commentId as string,
						event.locals.token?.userId as string
					)
				)
			),
			{
				status: 200
			}
		)
);

export async function deleteComment(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	commentId: string,
	userId: string
) {
	const comment = await client.comment.findFirst({
		where: {
			referenceType,
			referenceId,
			id: commentId,
			userId
		},
		select: {
			id: true
		}
	});
	if (!comment) {
		return null;
	}
	return await client.comment.update({
		data: {
			deleted: true,
			content: []
		},
		where: {
			id: comment.id
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

export function deleteComments(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string
) {
	return client.comment.deleteMany({
		where: {
			referenceType,
			referenceId
		}
	});
}
