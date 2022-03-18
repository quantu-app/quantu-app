import { run } from '$lib/prisma';
import type { Prompt, PromptPrivate } from '$lib/types';
import { isMultipleChoicePrivate, isInputPrivate } from '$lib/types';
import type { Challenge, QuestionType } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const departmentUrl: string = event.params.departmentUrl;

	return run((client) =>
		client.challenge.findMany({
			where: {
				department: {
					url: departmentUrl
				},
				results: {
					every: {
						userId: event.locals.token.userId
					}
				}
			},
			include: {
				results: true
			}
		})
	).then((challenges) => ({
		body: challenges.map((c) => {
			(c as any).result = c.results[0];
			delete c.results;
			removePrivate(c);
			return c;
		}),
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
