import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';
import { createNestedIncludeRecur } from '..';

export const GET = authenticated(async (event) => ({
	body: await run((client) =>
		getCommentsById(
			client,
			event.params.referenceType as CommentReferenceType,
			event.params.referenceId,
			event.params.commentId,
			parseInt(event.url.searchParams.get('depth') || '2')
		)
	),
	status: 200
}));

export async function getCommentsById(
	client: PrismaClient,
	referenceType: CommentReferenceType,
	referenceId: string,
	commentId: string,
	depth = 2
) {
	return await client.comment.findMany({
		where: {
			referenceType,
			referenceId,
			commentId
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
