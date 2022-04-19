import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Comment, PrismaClient } from '@prisma/client';
import { CommentReferenceType } from '@prisma/client';
import { getCommentsByReferenceId } from '../../../../../comments/[referenceType]/[referenceId]';

export const get = authenticated(async (event) => ({
	body: await run((client) =>
		getSolutions(
			client,
			event.params.departmentUrl,
			event.params.challengeUrl,
			parseInt(event.url.searchParams.get('depth') || '3')
		)
	),
	status: 200
}));

export async function getSolutions(
	client: PrismaClient,
	departmentUrl: string,
	challengeUrl: string,
	depth?: number
) {
	const solutions = await client.challengeSolution.findMany({
		where: {
			challenge: {
				department: {
					url: departmentUrl
				},
				url: challengeUrl
			}
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
	const comments = await getCommentsByReferenceId(
		client,
		CommentReferenceType.CHALLENGE_SOLUTION,
		solutions.map((s) => s.id),
		depth
	);
	const commentsByReferenceId = comments.reduce((map, comment) => {
		const comments = map[comment.referenceId] || (map[comment.referenceId] = []);
		comments.push(comment);
		return map;
	}, {} as Record<string, Comment[]>);

	return solutions.map((solution) => {
		(solution as any).comments = commentsByReferenceId[solution.id] || [];
		return solution;
	});
}

export const post = authenticated(async (event) => ({
	body: await run(async (client) =>
		createSolution(
			client,
			event.params.departmentUrl,
			event.params.challengeUrl,
			event.locals.token.userId,
			await event.request.json()
		)
	),
	status: 201
}));

export async function createSolution(
	client: PrismaClient,
	departmentUrl: string,
	challengeUrl: string,
	userId: string,
	data: any
) {
	const solution = await client.challengeSolution.create({
		data: {
			...data,
			user: {
				connect: {
					id: userId
				}
			},
			challenge: {
				connect: {
					url: challengeUrl,
					department: {
						connect: {
							url: departmentUrl
						}
					}
				}
			}
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
	(solution as any).comments = [];
	return solution;
}
