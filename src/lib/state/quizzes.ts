import { browser } from '$app/env';
import type { Quiz } from '$lib/api/quantu-app-api';
import { QuizService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IQuizzesStore {
	byId: { [id: number]: Quiz };
	byOrganizationId: { [organizationId: number]: { [id: number]: Quiz } };
}

const quizzesWritable = writable<IQuizzesStore>({
	byId: {},
	byOrganizationId: {}
});

export const quizzes: Readable<IQuizzesStore> = {
	subscribe: quizzesWritable.subscribe
};

export async function getQuiz(id: number) {
	const cachedQuiz = get(quizzes).byId[id];
	if (cachedQuiz) {
		return cachedQuiz;
	}
	const quiz = await load(QuizService.quantuAppWebControllerQuizShow(id));
	quizzesWritable.update((state) => addToState(state, quiz));
	return quiz;
}

export async function getQuizzes(organizationId?: number) {
	if (organizationId) {
		const cachedQuizzes = Object.values(
			get(quizzesWritable).byOrganizationId[organizationId] || {}
		);
		if (cachedQuizzes.length) {
			return cachedQuizzes;
		}
	} else {
		const cachedQuizzes = Object.values(get(quizzesWritable).byId || {});
		if (cachedQuizzes.length) {
			return cachedQuizzes;
		}
	}
	const quizzes = await load(QuizService.quantuAppWebControllerQuizIndex(organizationId));
	quizzesWritable.update((state) => quizzes.reduce(addToState, state));
	return quizzes;
}

function addToState(state: IQuizzesStore, quiz: Quiz): IQuizzesStore {
	const byOrganizationId =
		state.byOrganizationId[quiz.organizationId] ||
		(state.byOrganizationId[quiz.organizationId] = {});
	byOrganizationId[quiz.id] = quiz;
	state.byId[quiz.id] = quiz;
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		quizzesWritable.set({
			byId: {},
			byOrganizationId: {}
		})
	);
}
