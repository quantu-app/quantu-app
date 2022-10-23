import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { CommentReferenceType, PrismaClient } from '@prisma/client';
import { deleteComments } from '../../../../../../comments/[referenceType]/[referenceId]/[commentId]/+server';
import { getCommentsByReferenceId } from '../../../../../../comments/[referenceType]/[referenceId]/+server';

export const GET = authenticated(async (event) => {
	const solution = await run((client) =>
		getSolutionById(
			client,
			event.params.solutionId as string,
			parseInt(event.url.searchParams.get('depth') || '2')
		)
	);
	return new Response(JSON.stringify(solution), { status: solution ? 200 : 404 });
});

export async function getSolutionById(client: PrismaClient, solutionId: string, depth?: number) {
	const solution = await client.challengeSolution.findUnique({
		where: {
			id: solutionId
		},
		include: {
			challenge: {
				select: {
					name: true,
					url: true,
					department: {
						select: {
							url: true
						}
					}
				}
			},
			votes: true,
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});
	if (solution) {
		(solution as any).comments = await getCommentsByReferenceId(
			client,
			'CHALLENGE_SOLUTION' as CommentReferenceType,
			solution.id,
			depth
		);
	}
	return solution;
}

export const PATCH = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run(async (client) =>
					updateSolution(
						client,
						event.params.deparementUrl as string,
						event.params.challengeUrl as string,
						event.params.solutionId as string,
						event.locals.token?.userId as string,
						await event.request.json(),
						parseInt(event.url.searchParams.get('depth') || '2')
					)
				)
			),
			{
				status: 200
			}
		)
);

export async function updateSolution(
	client: PrismaClient,
	deparementUrl: string,
	challengeUrl: string,
	_solutionId: string,
	userId: string,
	data: any,
	depth?: number
) {
	const challenge = await client.challenge.findFirst({
		where: {
			url: challengeUrl,
			department: {
				url: deparementUrl
			}
		},
		select: {
			id: true
		}
	});
	if (!challenge) {
		return null;
	}
	const solution = await client.challengeSolution.update({
		where: {
			userId_challengeId: {
				userId,
				challengeId: challenge.id
			}
		},
		data: {
			solution: data.solution
		},
		include: {
			challenge: {
				select: {
					name: true,
					url: true,
					department: {
						select: {
							url: true
						}
					}
				}
			},
			votes: true,
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});
	if (solution) {
		(solution as any).comments = await getCommentsByReferenceId(
			client,
			'CHALLENGE_SOLUTION' as CommentReferenceType,
			solution.id,
			depth
		);
	}
	return solution;
}

export const DELETE = authenticated(async (event) => {
	const solution = await run((client) =>
		deleteSolutionById(
			client,
			event.params.deparementUrl as string,
			event.params.challengeUrl as string,
			event.params.solutionId as string,
			event.locals.token?.userId as string
		)
	);
	return new Response(JSON.stringify(solution), { status: solution ? 200 : 404 });
});

export async function deleteSolutionById(
	client: PrismaClient,
	deparementUrl: string,
	challengeUrl: string,
	solutionId: string,
	userId: string
) {
	const challenge = await client.challenge.findFirst({
		where: {
			url: challengeUrl,
			department: {
				url: deparementUrl
			}
		},
		select: {
			id: true
		}
	});
	if (!challenge) {
		return null;
	}
	const solution = await client.challengeSolution.delete({
		where: {
			userId_challengeId: {
				userId,
				challengeId: challenge.id
			}
		},
		include: {
			challenge: {
				select: {
					name: true,
					url: true,
					department: {
						select: {
							url: true
						}
					}
				}
			},
			votes: true,
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});
	await deleteComments(client, 'CHALLENGE_SOLUTION' as CommentReferenceType, solutionId);
	return solution;
}
