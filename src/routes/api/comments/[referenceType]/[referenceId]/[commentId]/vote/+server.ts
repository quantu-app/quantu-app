import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const PATCH = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run(async (client) =>
					voteOnComment(
						client,
						event.locals.token?.userId as string,
						event.params.commentId as string,
						await event.request.json()
					)
				)
			),
			{
				status: 200
			}
		)
);

export async function voteOnComment(
	client: PrismaClient,
	userId: string,
	commentId: string,
	vote: boolean | null
) {
	return await client.commentVote.upsert({
		create: {
			userId,
			commentId,
			vote
		},
		update: {
			vote
		},
		where: {
			userId_commentId: {
				userId,
				commentId
			}
		}
	});
}
