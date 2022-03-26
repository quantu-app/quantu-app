import type { QuestionType } from '@prisma/client';
import { run } from '$lib/prisma';
import type {
	Answer,
	FlashCardAnswer,
	InputPrivate,
	MultipleChoiceAnswer,
	MultipleChoicePrivate,
	PromptPrivate
} from '$lib/types';
import { InputType } from '$lib/types';
import { authenticated } from '$lib/api/auth';

export const get = authenticated((event) => {
	const id = event.params.id;

	return run((client) =>
		client.result.findUnique({
			where: {
				userId_challengeId: {
					userId: event.locals.token.userId,
					challengeId: id
				}
			}
		})
	).then((result) => ({
		body: result,
		status: result ? 200 : 404
	}));
});

export const post = authenticated(async (event) => {
	const answer: Answer = await event.request.json();
	const id = event.params.id;

	return run(async (client) => {
		const question = await client.challenge.findUnique({
			where: {
				id
			}
		});

		const data = {
			answer,
			challengeId: id,
			prompt: question.prompt,
			type: question.type,
			value: getResult(question.type, question.prompt as unknown as PromptPrivate, answer),
			userId: event.locals.token.userId
		};
		return client.result.upsert({
			where: {
				userId_challengeId: {
					userId: event.locals.token.userId,
					challengeId: id
				}
			},
			update: data,
			create: data
		});
	}).then((result) => ({
		body: result,
		status: 201
	}));
});

function getResult(type: QuestionType, prompt: PromptPrivate, answer: Answer): number {
	switch (type) {
		case 'MULTIPLE_CHOICE': {
			const multipleChoicePrompt = prompt as MultipleChoicePrivate;
			const multipleChoiceAnswer = answer as MultipleChoiceAnswer;
			const correctChoices = multipleChoicePrompt.choices.filter((choice) => choice.correct);

			const correct = correctChoices.reduce(
				(result, choice) =>
					choice.correct && multipleChoiceAnswer.includes(choice.id) ? result + 1 : result,
				0
			);

			return correct / correctChoices.length;
		}
		case 'INPUT': {
			const inputPrompt = prompt as InputPrivate;

			// TODO: actually check based on the input type
			switch (inputPrompt.type) {
				case InputType.LATEX:
					return inputPrompt.answers.includes(answer as string) ? 1 : 0;
				case InputType.NUMBER:
					return inputPrompt.answers.includes(answer as string) ? 1 : 0;
				default:
					return inputPrompt.answers.includes(answer as string) ? 1 : 0;
			}
		}
		case 'FLASH_CARD': {
			return answer as FlashCardAnswer;
		}
		case 'MARK_AS_READ': {
			return answer ? 1 : 0;
		}
		default: {
			return 0;
		}
	}
}
