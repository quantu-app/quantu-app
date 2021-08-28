import { browser } from '$app/env';
import type { QuestionAnswer, QuestionResult } from '$lib/api/quantu-app-api';
import { QuestionService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IQuestionResultsStore {
	byId: { [id: number]: QuestionResult };
	byQuizId: { [quizId: number]: { [id: number]: QuestionResult } };
}

const questionResultsWritable = writable<IQuestionResultsStore>({
	byId: {},
	byQuizId: {}
});

export const questionResults: Readable<IQuestionResultsStore> = {
	subscribe: questionResultsWritable.subscribe
};

export async function getQuestionResult(id: number) {
	const cachedQuestionResult = get(questionResults).byId[id];
	if (cachedQuestionResult) {
		return cachedQuestionResult;
	}
	const questionResult = await load(QuestionService.quantuAppWebControllerQuestionResultShow(id));
	questionResultsWritable.update((state) => addToState(state, questionResult));
	return questionResult;
}

export async function getQuestionResults(quizId?: number, force = false) {
	if (!force) {
		if (quizId) {
			const cachedQuestionResults = Object.values(
				get(questionResultsWritable).byQuizId[quizId] || {}
			);
			if (cachedQuestionResults.length) {
				return cachedQuestionResults;
			}
		} else {
			const cachedQuestionResults = Object.values(get(questionResultsWritable).byId || {});
			if (cachedQuestionResults.length) {
				return cachedQuestionResults;
			}
		}
	}
	const questionResults = await load(
		QuestionService.quantuAppWebControllerQuestionResultIndex(quizId)
	);
	questionResultsWritable.update((state) => {
		if (quizId) {
			state.byQuizId[quizId] = {};
		}
		return questionResults.reduce(
			(state, questionResult) => addToState(state, questionResult, quizId),
			state
		);
	});
	return questionResults;
}

export async function answerQuestion(id: number, input: QuestionAnswer['input'], quizId?: number) {
	const questionResult = await load(
		QuestionService.quantuAppWebControllerQuestionAnswer(id, { input })
	);
	questionResultsWritable.update((state) => addToState(state, questionResult, quizId));
	return questionResult;
}

function addToState(
	state: IQuestionResultsStore,
	questionResult: QuestionResult,
	quizId?: number
): IQuestionResultsStore {
	if (quizId) {
		const byQuizId = state.byQuizId[quizId] || (state.byQuizId[quizId] = {});
		byQuizId[questionResult.id] = questionResult;
	}
	state.byId[questionResult.id] = questionResult;
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		questionResultsWritable.set({
			byId: {},
			byQuizId: {}
		})
	);
}
