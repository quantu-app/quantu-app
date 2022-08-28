import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, Result } from '@prisma/client';
import { removePrivate } from '../../_utils';

const DEFAULT_PAGINATION_SIZE = 25;

export const GET = authenticated(async (event) => ({
	body: await run((client) =>
		getChallenges(
			client,
			event.locals.token?.userId,
			undefined,
			undefined,
			event.params.departmentUrl
		)
	),
	status: 200
}));

export async function getChallenges(
	client: PrismaClient,
	userId: string,
	page?: number,
	size?: number,
	departmentUrl?: string
) {
	page = page ? page : 0;
	size = size ? size : DEFAULT_PAGINATION_SIZE;

	const where = {
		visible: true,
		NOT: [{ releasedAt: null }],

		releasedAt: {
			lte: new Date()
		}
	};
	if (departmentUrl) {
		(where as any).department = { url: departmentUrl };
	}

	const challenges = await client.challenge.findMany({
		where,
		skip: page * size,
		take: size,
		include: {
			department: {
				select: {
					url: true,
					name: true
				}
			}
		},
		orderBy: {
			releasedAt: 'desc'
		}
	});

	const challengeIds = challenges.map((challenge) => challenge.id);
	const [results, answers, solutions] = await Promise.all([
		client.result.findMany({
			where: {
				userId,
				challengeId: {
					in: challengeIds
				}
			}
		}),
		client.result.findMany({
			where: {
				challengeId: {
					in: challengeIds
				}
			},
			select: {
				userId: true,
				challengeId: true,
				value: true
			}
		}),
		client.challengeSolution.groupBy({
			by: ['challengeId'],
			_count: { _all: true },
			where: {
				challengeId: {
					in: challengeIds
				}
			}
		})
	]);

	const resultMap = results.reduce((map, result) => {
		map[result.challengeId as string] = result;
		return map;
	}, {} as Record<string, Result>);

	const answersMap = answers.reduce((map, answer) => {
		const values = map[answer.challengeId as string] || (map[answer.challengeId as string] = []);
		values.push({ value: answer.value, userId: answer.userId });
		return map;
	}, {} as Record<string, { value: number; userId: string }[]>);

	const solutionsMap = solutions.reduce((map, solutions) => {
		map[solutions.challengeId as string] = solutions._count._all;
		return map;
	}, {} as Record<string, number>);

	return challenges.map((challenge) => {
		(challenge as any).result = resultMap[challenge.id];
		(challenge as any).answers = answersMap[challenge.id] || [];
		(challenge as any).solutions = solutionsMap[challenge.id] || 0;
		return removePrivate(challenge);
	});
}
