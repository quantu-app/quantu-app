import { browser } from '$app/env';
import type {
	QuestionPrivate,
	QuestionCreate,
	QuestionFlashCardPrivate,
	QuestionMultipleChoicePrivate,
	QuestionPromptPrivate,
	QuestionUpdate
} from '$lib/api/quantu-app-api';
import { UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IOrganizationQuestionsStore {
	byId: { [id: number]: QuestionPrivate };
	byOrganizationId: {
		[organizationId: number]: { [id: number]: QuestionPrivate };
	};
	byQuizId: {
		[organizationId: number]: { [id: number]: QuestionPrivate };
	};
}

const organizationQuestionsWritable = writable<IOrganizationQuestionsStore>({
	byId: {},
	byOrganizationId: {},
	byQuizId: {}
});

export const organizationQuestions: Readable<IOrganizationQuestionsStore> = {
	subscribe: organizationQuestionsWritable.subscribe
};

export async function getQuestion(organizationId: number, id: number) {
	const cachedQuestion = get(organizationQuestions).byId[id];
	if (cachedQuestion) {
		return cachedQuestion;
	}
	const question = await load(
		UserService.quantuAppWebControllerUserQuestionShow(id, organizationId)
	);
	organizationQuestionsWritable.update((state) => addToState(state, question));
	return question;
}

export async function getQuestions(organizationId: number, quizId?: number) {
	if (quizId) {
		const cachedQuestions = Object.values(get(organizationQuestions).byQuizId[quizId] || {});
		if (cachedQuestions.length) {
			return cachedQuestions;
		}
	}
	const questions = await load(
		UserService.quantuAppWebControllerUserQuestionIndex(organizationId, quizId)
	);
	organizationQuestionsWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		if (quizId) {
			state.byQuizId[quizId] = {};
		}
		return questions.reduce(addToState, state);
	});
	return questions;
}

export async function createQuestion(organizationId: number, params: QuestionCreate) {
	const question = await load(
		UserService.quantuAppWebControllerUserQuestionCreate(
			organizationId,
			cleanQuestion(params) as QuestionCreate
		)
	);
	organizationQuestionsWritable.update((state) => addToState(state, question));
	return question;
}

export async function updateQuestion(organizationId: number, id: number, params: QuestionUpdate) {
	const question = await load(
		UserService.quantuAppWebControllerUserQuestionUpdate(id, organizationId, cleanQuestion(params))
	);
	organizationQuestionsWritable.update((state) => addToState(state, question));
	return question;
}

export async function deleteQuestion(organizationId: number, id: number) {
	const question = get(organizationQuestionsWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserQuestionDelete(question.id, organizationId));
	organizationQuestionsWritable.update((state) => deleteFromState(state, question));
}

function addToState(
	state: IOrganizationQuestionsStore,
	question: QuestionPrivate
): IOrganizationQuestionsStore {
	const byOrganizationId =
		state.byOrganizationId[question.organizationId] ||
		(state.byOrganizationId[question.organizationId] = {});

	if (question.quizId) {
		const byQuizId = state.byQuizId[question.quizId] || (state.byQuizId[question.quizId] = {});
		byQuizId[question.id] = question;
		question = { ...question, quizId: null, index: null };
	}
	byOrganizationId[question.id] = question;
	state.byId[question.id] = question;
	return state;
}

function deleteFromState(
	state: IOrganizationQuestionsStore,
	question: QuestionPrivate
): IOrganizationQuestionsStore {
	const byOrganizationId =
		state.byOrganizationId[question.organizationId] ||
		(state.byOrganizationId[question.organizationId] = {});
	for (const questions of Object.values(state.byQuizId || {})) {
		if (question.id in questions) {
			delete questions[question.id];
		}
	}
	delete byOrganizationId[question.id];
	delete state.byId[question.id];
	return state;
}

function cleanQuestion(question: QuestionCreate | QuestionUpdate): QuestionCreate | QuestionUpdate {
	if (question.prompt) {
		question.prompt = cleanQuestionPrompt(question.type, question.prompt);
	}
	return question;
}
function cleanQuestionPrompt(type: string, prompt: QuestionPromptPrivate): QuestionPromptPrivate {
	if (type === 'flash_card') {
		const flashCard = prompt as QuestionFlashCardPrivate;
		return {
			front: flashCard.front,
			back: flashCard.back
		};
	} else if (type === 'multiple_choice') {
		const multipleChoice = prompt as QuestionMultipleChoicePrivate;
		return {
			question: multipleChoice.question,
			explanation: multipleChoice.explanation,
			choices: multipleChoice.choices
		};
	}
}

if (browser) {
	userEmitter.on('signOut', () =>
		organizationQuestionsWritable.set({
			byId: {},
			byQuizId: {},
			byOrganizationId: {}
		})
	);
}
