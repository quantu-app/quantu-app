import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';

export const get = authenticated(async (event) => ({
	body: await run((client) =>
		getCommentsByReferenceId(
			client,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			parseInt(event.url.searchParams.get('depth') || '3')
		)
	),
	status: 200
}));

export async function getCommentsByReferenceId(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string | string[],
	depth = 3
) {
	const where = {
		referenceType
	} as any;
	if (Array.isArray(referenceId)) {
		where.referenceId = { in: referenceId };
	} else {
		where.referenceId = referenceId;
	}
	const comments = await client.comment.findMany({
		where,
		include: {
			commentVotes: true,
			comments: createNestedIncludeRecur(depth)
		}
	});

	return comments;
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

export const post = authenticated(async (event) => ({
	body: await run(async (client) =>
		createComment(
			client,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			await event.request.json()
		)
	),
	status: 200
}));

export async function createComment(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	data: any
) {
	const comment = await client.comment.create({
		data: {
			...data,
			referenceType,
			referenceId
		},
		include: {
			commentVotes: true,
			comments: true
		}
	});

	return comment;
}
