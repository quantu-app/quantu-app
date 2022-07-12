import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from '..';

export async function get(event: RequestEvent) {
	const challenge = await run((client) =>
		getChallengeByUrl(
			client,
			event.locals.token.userId,
			event.params.departmentUrl,
			event.params.challengeUrl
		)
	);

	return {
		body: challenge,
		status: challenge ? 200 : 404
	};
}

export async function getChallengeByUrl(
	client: PrismaClient,
	userId: string,
	departmentUrl: string,
	challengeUrl: string
) {
	const challenge = await client.challenge.findFirst({
		where: {
			url: challengeUrl,
			department: {
				url: departmentUrl
			}
		},
		include: {
			department: {
				select: {
					url: true,
					name: true
				}
			}
		}
	});

	if (challenge) {
		const [result, answers, solutions] = await Promise.all([
			client.result.findUnique({
				where: {
					userId_challengeId: {
						userId: userId,
						challengeId: challenge.id
					}
				}
			}),
			client.result.findMany({
				where: {
					challengeId: challenge.id
				},
				select: {
					value: true
				}
			}),
			client.challengeSolution.aggregate({
				_count: { _all: true },
				where: {
					challengeId: challenge.id
				}
			})
		]);
		(challenge as any).result = result;
		(challenge as any).answers = answers.map((answer) => answer.value);
		(challenge as any).solutions = solutions._count._all;
	}

	return removePrivate(challenge);
}
