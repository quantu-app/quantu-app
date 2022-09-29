import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, CommentReferenceType } from '@prisma/client';
import { createNestedIncludeRecur } from '../../+server';

export const GET = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run((client) =>
					getCommentsById(
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
