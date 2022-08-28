import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Comment, PrismaClient } from '@prisma/client';
import type { CommentReferenceType } from '@prisma/client';
import { getCommentsByReferenceId } from '../../../../../comments/[referenceType]/[referenceId]';

export const GET = authenticated(async (event) => ({
	body: await run((client) =>
		getSolutions(
			client,
			event.params.departmentUrl,
			event.params.challengeUrl,
			parseInt(event.url.searchParams.get('depth') || '2')
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
	const comments = await getCommentsByReferenceId(
		client,
		'CHALLENGE_SOLUTION' as CommentReferenceType,
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

export const POST = authenticated(async (event) => ({
	body: await run(async (client) =>
		createSolution(
			client,
			event.params.departmentUrl,
			event.params.challengeUrl,
			event.locals.token?.userId,
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
					departmentId_url: {
						url: challengeUrl,
						departmentId: (
							await client.department.findUnique({
								where: { url: departmentUrl },
								select: { id: true }
							})
						).id
					}
				}
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
	(solution as any).comments = [];
	return solution;
}
