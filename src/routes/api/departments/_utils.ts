import { isMultipleChoicePrivate, type Prompt, type PromptPrivate } from '$lib/types';
import type { Challenge, QuestionType, Section } from '@prisma/client';

export function removePrivate<T extends Challenge | Section>(question: T | null): T | null {
	if (question) {
		question.prompt = removePrivatePrompt(question.type, question.prompt as any) as any;
	}
	return question;
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
