import { browser } from '$app/env';
import type { Question, QuestionAnswer } from '$lib/api/quantu-app-api';
import { QuestionService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IQuestionsStore {
	byId: { [id: number]: Question };
	byQuizId: { [quizId: number]: { [id: number]: Question } };
	byOrganizationId: { [organizationId: number]: { [id: number]: Question } };
}

const questionsWritable = writable<IQuestionsStore>({
	byId: {},
	byQuizId: {},
	byOrganizationId: {}
});

export const questions: Readable<IQuestionsStore> = {
	subscribe: questionsWritable.subscribe
};

export async function getQuestion(id: number) {
	const cachedQuestion = get(questions).byId[id];
	if (cachedQuestion) {
		return cachedQuestion;
	}
	const question = await load(QuestionService.quantuAppWebControllerQuestionShow(id));
	questionsWritable.update((state) => addToState(state, question));
	return question;
}

export async function getQuestions(organizationId?: number, quizId?: number) {
	if (quizId) {
		const cachedQuestions = Object.values(get(questionsWritable).byQuizId[quizId] || {});
		if (cachedQuestions.length) {
			if (organizationId) {
				return cachedQuestions.filter((question) => question.organizationId === organizationId);
			} else {
				return cachedQuestions;
			}
		}
	} else if (organizationId) {
		const cachedQuestions = Object.values(
			get(questionsWritable).byOrganizationId[organizationId] || {}
		);
		if (cachedQuestions.length) {
			return cachedQuestions;
		}
	} else {
		const cachedQuestions = Object.values(get(questionsWritable).byId || {});
		if (cachedQuestions.length) {
			return cachedQuestions;
		}
	}
	const questions = await load(
		QuestionService.quantuAppWebControllerQuestionIndex(organizationId, quizId)
	);
	questionsWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		if (quizId) {
			state.byQuizId[quizId] = {};
		}
		return questions.reduce(addToState, state);
	});
	return questions;
}

export async function addQuestionsToQuiz(
	organizationId: number,
	quizId: number,
	questionIds: number[]
) {
	questionsWritable.update((state) => {
		const byOrganizationId =
				state.byOrganizationId[organizationId] || (state.byOrganizationId[organizationId] = {}),
			byQuizId = state.byQuizId[quizId] || (state.byQuizId[quizId] = {});

		for (const questionId of questionIds) {
			const question = byOrganizationId[questionId];
			byQuizId[questionId] = { ...question, quizId: quizId };
		}

		return state;
	});
}

export async function removeQuestionsFromQuiz(quizId: number, questionIds: number[]) {
	questionsWritable.update((state) => {
		const byQuizId = state.byQuizId[quizId] || (state.byQuizId[quizId] = {});

		for (const questionId of questionIds) {
			delete byQuizId[questionId];
		}

		return state;
	});
}

export async function answerQuestion(id: number, input: QuestionAnswer['input']) {
	return await load(QuestionService.quantuAppWebControllerQuestionAnswer(id, { input }));
}

function addToState(state: IQuestionsStore, question: Question): IQuestionsStore {
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

if (browser) {
	userEmitter.on('signOut', () =>
		questionsWritable.set({
			byId: {},
			byQuizId: {},
			byOrganizationId: {}
		})
	);
}
