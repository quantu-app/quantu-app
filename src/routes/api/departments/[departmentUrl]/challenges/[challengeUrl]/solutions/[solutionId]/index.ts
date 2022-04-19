import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import { CommentReferenceType, type PrismaClient } from '@prisma/client';
import { getCommentsByReferenceId } from '../../../../../../comments/[referenceType]/[referenceId]';

export const get = authenticated(async (event) => {
	const solution = await run((client) =>
		getSolutionById(
			client,
			event.params.solutionId,
			parseInt(event.url.searchParams.get('depth') || '3')
		)
	);
	return {
		body: solution,
		status: solution ? 200 : 404
	};
});

export async function getSolutionById(client: PrismaClient, solutionId: string, depth?: number) {
	const solution = await client.challengeSolution.findUnique({
		where: {
			id: solutionId
		},
		include: {
			challenge: {
				select: {
					url: true,
					department: {
						select: {
							url: true
						}
					}
				}
			},
			challengeSolutionVotes: true
		}
	});
	if (solution) {
		(solution as any).comments = await getCommentsByReferenceId(
			client,
			CommentReferenceType.CHALLENGE_SOLUTION,
			solution.id,
			depth
		);
	}
	return solution;
}

export const patch = authenticated(async (event) => ({
	body: await run(async (client) =>
		updateSolution(
			client,
			event.params.deparementUrl,
			event.params.challengeUrl,
			event.params.solutionId,
			event.locals.token.userId,
			await event.request.json(),
			parseInt(event.url.searchParams.get('depth') || '3')
		)
	),
	status: 200
}));

export async function updateSolution(
	client: PrismaClient,
	deparementUrl: string,
	challengeUrl: string,
	solutionId: string,
	userId: string,
	data: any,
	depth?: number
) {
	const solution = await client.challengeSolution.update({
		where: {
			id: solutionId,
			userId_challengeId: {
				userId,
				challengeId: (
					await client.challenge.findFirst({
						where: {
							url: challengeUrl,
							department: {
								url: deparementUrl
							}
						},
						select: {
							id: true
						}
					})
				).id
			}
		},
		data,
		include: {
			challenge: {
				select: {
					url: true,
					department: {
						select: {
							url: true
						}
					}
				}
			},
			challengeSolutionVotes: true
		}
	});
	if (solution) {
		(solution as any).comments = await getCommentsByReferenceId(
			client,
			CommentReferenceType.CHALLENGE_SOLUTION,
			solution.id,
			depth
		);
	}
	return solution;
}
