import type { ResultType } from '@prisma/client';
import type { QuestionType } from '@prisma/client';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { decode } from '$lib/api/jwt';
import {
	Answer,
	FlashCardAnswer,
	InputPrivate,
	InputType,
	MultipleChoiceAnswer,
	MultipleChoicePrivate,
	PromptPrivate
} from '$lib/types';

export async function get(event: RequestEvent) {
	const { userId } = await decode<{ userId: string }>(event.locals.token);
	const resultType = event.params.type.toUpperCase() as ResultType;
	const questionId = event.params.questionId;

	return run((client) =>
		client.result.findUnique({
			where: {
				userId_resultType_questionId: {
					userId,
					resultType,
					questionId
				}
			}
		})
	).then((result) => ({
		body: result,
		status: 200
	}));
}

export async function post(event: RequestEvent) {
	const { userId } = await decode<{ userId: string }>(event.locals.token);
	const answer: Answer = await event.request.json();
	const resultType = event.params.type.toUpperCase() as ResultType;
	const questionId = event.params.questionId;

	return run(async (client) => {
		const question = await client.challenge.findUnique({
			where: {
				id: questionId
			}
		});

		return client.result.create({
			data: {
				answer,
				resultType,
				questionId,
				prompt: question.prompt,
				type: question.type,
				value: getResult(question.type, question.prompt as unknown as PromptPrivate, answer),
				userId
			}
		});
	}).then((result) => ({
		body: result,
		status: 201
	}));
}

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
