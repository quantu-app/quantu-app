import { authenticated } from '$lib/api/auth';
import { validUsernameRegex } from '$lib/components/user/userProfileSuite';
import { run } from '$lib/prisma';
import type { Prompt, PromptPrivate } from '$lib/types';
import { isMultipleChoicePrivate, isInputPrivate } from '$lib/types';
import type { Challenge, PrismaClient, QuestionType, Result } from '@prisma/client';

const DEFAULT_PAGINATION_SIZE = 25;

export const get = authenticated(async (event) => ({
	body: await run((client) =>
		getChallenges(
			client,
			event.locals.token.userId,
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

	const [results, answers, solutions] = await Promise.all([
		client.result.findMany({
			where: {
				userId,
				challengeId: {
					in: challenges.map((challenge) => challenge.id)
				}
			}
		}),
		client.result.findMany({
			where: {
				challengeId: {
					in: challenges.map((challenge) => challenge.id)
				}
			},
			select: {
				challengeId: true,
				value: true
			}
		}),
		client.challengeSolution.groupBy({
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
		map[result.challengeId as string] = result;
		return map;
	}, {} as Record<string, Result>);

	const answersMap = answers.reduce((map, answer) => {
		const values = map[answer.challengeId as string] || (map[answer.challengeId as string] = []);
		values.push(answer.value);
		return map;
	}, {} as Record<string, number[]>);

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
