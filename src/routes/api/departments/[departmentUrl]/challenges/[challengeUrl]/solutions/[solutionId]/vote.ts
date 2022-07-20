import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const PATCH = authenticated(async (event) => ({
	body: await run(async (client) =>
		voteOnChallengeSolution(
			client,
			event.locals.token.userId,
			event.params.solutionId,
			await event.request.json()
		)
	),
	status: 200
}));

export async function voteOnChallengeSolution(
	client: PrismaClient,
	userId: string,
	challengeSolutionId: string,
	vote: boolean | null
) {
	return await client.challengeSolutionVote.upsert({
		create: {
			userId,
			challengeSolutionId,
			vote
		},
		update: {
			vote
		},
		where: {
			userId_challengeSolutionId: {
				userId,
				challengeSolutionId
			}
		}
	});
}
