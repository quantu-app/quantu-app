import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Prompt, PromptPrivate } from '$lib/types';
import { isMultipleChoicePrivate, isInputPrivate } from '$lib/types';
import type { Challenge, PrismaClient, QuestionType, Result } from '@prisma/client';

export const get = authenticated(async (event) => ({
	body: await run((client) =>
		getChallenges(client, event.locals.token.userId, event.params.departmentUrl)
	),
	status: 200
}));

export async function getChallenges(client: PrismaClient, userId: string, departmentUrl?: string) {
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

	const [results, solvers] = await Promise.all([
		client.result.findMany({
			where: {
				userId: userId,
				challengeId: {
					in: challenges.map((challenge) => challenge.id)
				}
			}
		}),
		client.result.groupBy({
			by: ['challengeId'],
			_count: { _all: true },
			where: {
				challengeId: {
					in: challenges.map((challenge) => challenge.id)
				}
			}
		})
	]);

	const resultMap = results.reduce((map, result) => {
		map[result.challengeId] = result;
		return map;
	}, {} as Record<string, Result>);
	const solverMap = solvers.reduce((map, solver) => {
		map[solver.challengeId] = solver._count._all;
		return map;
	}, {} as Record<string, number>);

	return challenges.map((challenge) => {
		(challenge as any).result = resultMap[challenge.id];
		(challenge as any).solvers = solverMap[challenge.id] || 0;
		return removePrivate(challenge);
	});
}

export function removePrivate(challenge: Challenge | null): Challenge | null {
	if (challenge) {
		challenge.prompt = removePrivatePrompt(challenge.type, challenge.prompt as any) as any;
	}
	return challenge;
}

function removePrivatePrompt(type: QuestionType, prompt: PromptPrivate): Prompt {
	if (isMultipleChoicePrivate(type, prompt)) {
		prompt.choices.forEach((choice) => {
			delete choice.correct;
		});
		delete prompt.explanation;
	} else if (isInputPrivate(type, prompt)) {
		delete prompt.answers;
	}
	return prompt;
}
