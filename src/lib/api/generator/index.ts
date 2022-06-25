import type { PromptPrivate } from '$lib/types';
import { XorShiftRng, type Rng } from '@aicacia/rand';
import type { QuestionType } from '@prisma/client';

export interface IGeneratorOptions {
	seed: number;
	rng: Rng;
}

export interface IQuestion {
	type: QuestionType;
	prompt: PromptPrivate;
}

export abstract class Generator<C> {
	config: C;
	rng: Rng;

	constructor(config: C, options: Partial<IGeneratorOptions> = {}) {
		this.config = config;
		this.rng = options.rng || new XorShiftRng(options.seed || Date.now());
	}

	abstract generate(): IQuestion;
}
