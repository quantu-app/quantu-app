import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Comment, PrismaClient } from '@prisma/client';
import type { CommentReferenceType } from '@prisma/client';
import { getCommentsByReferenceId } from '../../../../../comments/[referenceType]/[referenceId]/+server';

export const GET = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run((client) =>
					getSolutions(
						client,
						event.params.departmentUrl as string,
						event.params.challengeUrl as string,
						parseInt(event.url.searchParams.get('depth') || '2')
					)
				)
			),
			{
				status: 200
			}
		)
);

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

export const POST = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run(async (client) =>
					createSolution(
						client,
						event.params.departmentUrl as string,
						event.params.challengeUrl as string,
						event.locals.token?.userId as string,
						await event.request.json()
					)
				)
			),
			{
				status: 201
			}
		)
);

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
						department: { url: departmentUrl }
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
