import type Op from 'quill-delta/dist/Op';

export interface FlashCardPrivate {
	back: Op[];
	front: Op[];
}

export interface FlashCard {
	back: Op[];
	front: Op[];
}

export type FlashCardAnswer = number;

export interface MarkAsReadPrivate {
	content: Op[];
}

export interface MarkAsRead {
	content: Op[];
}

export type MarkAsReadAnswer = boolean;

export enum InputType {
	NUMBER = 'number',
	LATEX = 'latex',
	TEXT = 'text'
}

export interface InputPrivate {
	answers: string[];
	explanation?: Op[];
	question: Op[];
	type: InputType;
}

export interface Input {
	question: Op[];
	type: InputType;
}

export type InputAnswer = string;

export interface MultipleChoicePrivate {
	choices: Array<{
		id: string;
		content: Op[];
		correct: boolean;
	}>;
	explanation?: Op[];
	question: Op[];
}

export interface MultipleChoice {
	choices: Array<{
		id: string;
		content: Op[];
	}>;
	question: Op[];
}

export type MultipleChoiceAnswer = string[];

export type Answer = FlashCardAnswer | MarkAsReadAnswer | InputAnswer | MultipleChoiceAnswer;
export type PromptPrivate =
	| FlashCardPrivate
	| MarkAsReadPrivate
	| InputPrivate
	| MultipleChoicePrivate;
export type Prompt = FlashCard | MarkAsRead | Input | MultipleChoice;
