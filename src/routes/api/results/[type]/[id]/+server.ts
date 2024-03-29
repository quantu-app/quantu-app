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
		getResultById(
			client,
			event.locals.token?.userId as string,
			event.params.type as string,
			event.params.id as string
		)
	);
	if (result) {
		return new Response(null, {
			status: 404
		});
	} else {
		return new Response(JSON.stringify(result), {
			status: 200
		});
	}
});

export function getResultById(client: PrismaClient, userId: string, type: string, id: string) {
	return client.result.findFirst({
		where: {
			userId,
			challengeId: type === 'challenge' ? id : undefined,
			lessonBlockId: type === 'lesson-block' ? id : undefined
		}
	});
}

export const POST = authenticated(async (event) =>
	run(async (client) =>
		answer(
			client,
			event.locals.token?.userId as string,
			event.params.type as string,
			event.params.id as string,
			await event.request.json()
		)
	).then((result) =>
		result
			? new Response(JSON.stringify(result), { status: 201 })
			: new Response(null, { status: 404 })
	)
);

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

	const prevResult = await client.result.findFirst({
		where:
			type === 'challenge'
				? {
						userId,
						challengeId: id
				  }
				: {
						userId,
						lessonBlockId: id
				  }
	});

	const data: any = {
		answer,
		prompt: question.prompt,
		type: question.type,
		value: getResult(question.type, question.prompt as unknown as PromptPrivate, answer),
		userId,
		challengeId: type === 'challenge' ? id : undefined,
		lessonBlockId: type === 'lesson-block' ? id : undefined
	};

	if (prevResult) {
		return client.result.update({
			where: {
				id: prevResult.id
			},
			data
		});
	} else {
		return client.result.create({
			data
		});
	}
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
