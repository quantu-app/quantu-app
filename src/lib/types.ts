import type { QuestionType, Result } from '@prisma/client';
import type { IElement, IText } from '$lib/components/editor';

export interface FlashCardPrivate {
	back: Array<IElement | IText>;
	front: Array<IElement | IText>;
}

export interface FlashCard {
	back: Array<IElement | IText>;
	front: Array<IElement | IText>;
}

export type FlashCardAnswer = number;

export interface MarkAsReadPrivate {
	content: Array<IElement | IText>;
}

export interface MarkAsRead {
	content: Array<IElement | IText>;
}

export type MarkAsReadAnswer = boolean;

export enum InputType {
	NUMBER = 'number',
	LATEX = 'latex',
	TEXT = 'text'
}

export interface InputPrivate {
	answers: (string | number)[];
	explanation?: Array<IElement | IText>;
	question: Array<IElement | IText>;
	type: InputType;
}

export interface Input {
	question: Array<IElement | IText>;
	type: InputType;
}

export type InputAnswer = string;

export interface MultipleChoicePrivate {
	singleAnswer?: boolean;
	choices: Array<{
		id: string;
		content: Array<IElement | IText>;
		correct: boolean;
	}>;
	explanation?: Array<IElement | IText>;
	question: Array<IElement | IText>;
}

export interface MultipleChoice {
	singleAnswer?: boolean;
	choices: Array<{
		id: string;
		content: Array<IElement | IText>;
	}>;
	question: Array<IElement | IText>;
}

export type MultipleChoiceAnswer = string[];

export type Answer = FlashCardAnswer | MarkAsReadAnswer | InputAnswer | MultipleChoiceAnswer;
export type PromptPrivate =
	| FlashCardPrivate
	| MarkAsReadPrivate
	| InputPrivate
	| MultipleChoicePrivate;
export type Prompt = FlashCard | MarkAsRead | Input | MultipleChoice;

export type UserAnswers = {
	answers: { value: number; userId: string }[];
};

export type OptionalResult = {
	result?: Result;
};

export function isFlashCardPrivate(
	type: QuestionType,
	_prompt: PromptPrivate
): _prompt is FlashCardPrivate {
	return type === 'FLASH_CARD';
}

export function isMarkAsReadPrivate(
	type: QuestionType,
	_prompt: PromptPrivate
): _prompt is MarkAsReadPrivate {
	return type === 'MARK_AS_READ';
}

export function isInputPrivate(
	type: QuestionType,
	_prompt: PromptPrivate
): _prompt is InputPrivate {
	return type === 'INPUT';
}

export function isMultipleChoicePrivate(
	type: QuestionType,
	_prompt: PromptPrivate
): _prompt is MultipleChoicePrivate {
	return type === 'MULTIPLE_CHOICE';
}

export function typeToName(type: QuestionType) {
	switch (type) {
		case 'FLASH_CARD':
			return 'Flash Card';
		case 'INPUT':
			return 'Input';
		case 'MARK_AS_READ':
			return 'Mark as Read';
		case 'MULTIPLE_CHOICE':
			return 'Mutiple Choice';
	}
}

export function typeToIconName(type: QuestionType) {
	switch (type) {
		case 'FLASH_CARD':
			return 'postcard';
		case 'INPUT':
			return 'input-cursor';
		case 'MARK_AS_READ':
			return 'eyeglasses';
		case 'MULTIPLE_CHOICE':
			return 'list-task';
	}
}
