import { QuestionGenerator, type IQuestion } from '$lib/api/generator';
import { content } from '$lib/api/generator/Content';
import { InputType, type InputPrivate } from '$lib/types';
import { QuestionType } from '@prisma/client';

export interface IConfig {}

export class Generator extends QuestionGenerator<IConfig> {
	generate(): IQuestion {
		const a = this.rng.nextIntInRange(-10, 10);
		const b = this.rng.nextIntInRange(-10, 10);
		const answer = a + b;

		const question = content();
		question.math(`${a} + ${b} = x`);

		const explanation = content();
		question.math(`${a} + ${b} = ${answer}`);

		const prompt: InputPrivate = {
			type: InputType.NUMBER,
			explanation: explanation.build(),
			question: question.build(),
			answers: [answer]
		};

		return {
			type: QuestionType.INPUT,
			prompt
		};
	}
}
