import type { PrismaClient, QuestionType } from '@prisma/client';
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

export const GET = authenticated(async (event) => {
	const result = await run((client) =>
		getResultById(client, event.locals.token?.userId, event.params.type, event.params.id)
	);
	return {
		body: result,
		status: result ? 200 : 404
	};
});

export function getResultById(client: PrismaClient, userId: string, type: string, id: string) {
	return client.result.findFirst({
		where: {
			userId,
			challengeId: type === 'challenge' ? id : null,
			lessonBlockId: type === 'lesson-block' ? id : null
		}
	});
}

export const POST = authenticated(async (event) => ({
	body: await run(async (client) =>
		answer(
			client,
			event.locals.token?.userId,
			event.params.type,
			event.params.id,
			await event.request.json()
		)
	),
	status: 201
}));

export async function answer(
	client: PrismaClient,
	userId: string,
	type: string,
	id: string,
	answer: Answer
) {
	const question =
		type === 'challenge'
			? await client.challenge.findUnique({
					where: {
						id
					}
			  })
			: await client.lessonBlock.findUnique({
					where: {
						id
					}
			  });

	if (!question) {
		return null;
	}

	const data: any = {
		answer,
		prompt: question.prompt,
		type: question.type,
		value: getResult(question.type, question.prompt as unknown as PromptPrivate, answer)
	};
	const where: any = {};
	if (type === 'challenge') {
		where.userId_challengeId = {
			userId,
			challengeId: id
		};
		data.challengeId = id;
	} else {
		where.userId_lessonBlockId = {
			userId,
			lessonBlockId: id
		};
		data.lessonBlockId = id;
	}
	return client.result.upsert({
		where,
		update: data,
		create: {
			...data,
			userId
		}
	});
}

function getResult(type: QuestionType, prompt: PromptPrivate, answer: Answer): number {
	switch (type) {
		case 'MULTIPLE_CHOICE': {
			const multipleChoicePrompt = prompt as MultipleChoicePrivate;
			const multipleChoiceAnswer = answer as MultipleChoiceAnswer;
			const correctChoices = multipleChoicePrompt.choices.filter((choice) => choice.correct);

			if (!correctChoices.length) {
				return 1;
			} else {
				const correct = correctChoices.reduce(
					(result, choice) =>
						choice.correct && multipleChoiceAnswer.includes(choice.id) ? result + 1 : result,
					0
				);
				return correct / correctChoices.length;
			}
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
