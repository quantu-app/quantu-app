import { run } from '$lib/prisma';
import type { Prompt, PromptPrivate } from '$lib/types';
import { isMultipleChoicePrivate, isInputPrivate } from '$lib/types';
import type { Challenge, QuestionType } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const departmentUrl: string = event.params.departmentUrl;

	return run((client) =>
		client.challenge
			.findMany({
				where: {
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
				},
				orderBy: {
					releasedAt: 'desc'
				}
			})
			.then((challenges) =>
				client.result
					.findMany({
						where: {
							userId: event.locals.token.userId,
							challengeId: {
								in: challenges.map((challenge) => challenge.id)
							}
						}
					})
					.then((results) => {
						const resultMap = results.reduce((map, result) => {
							map[result.challengeId] = result;
							return map;
						}, {});
						return challenges.map((challenge) => {
							(challenge as any).result = resultMap[challenge.id];
							return challenge;
						});
					})
			)
	).then((challenges) => ({
		body: challenges.map(removePrivate),
		status: 200
	}));
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
