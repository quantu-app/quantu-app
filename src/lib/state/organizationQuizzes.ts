import { browser } from '$app/env';
import { Quiz, QuizCreate, UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IOrganizationQuizzesStore {
	byId: { [id: number]: Quiz };
	byOrganizationId: {
		[organizationId: number]: { [id: number]: Quiz };
	};
}

const organizationQuizzesWritable = writable<IOrganizationQuizzesStore>({
	byId: {},
	byOrganizationId: {}
});

export const organizationQuizzes: Readable<IOrganizationQuizzesStore> = {
	subscribe: organizationQuizzesWritable.subscribe
};

export async function getQuiz(organizationId: number, id: number) {
	const cachedQuiz = get(organizationQuizzes).byId[id];
	if (cachedQuiz) {
		return cachedQuiz;
	}
	const quiz = await load(UserService.quantuAppWebControllerUserQuizShow(id, organizationId));
	organizationQuizzesWritable.update((state) => addToState(state, quiz));
	return quiz;
}

export async function getQuizzes(organizationId: number) {
	const quizzes = await load(UserService.quantuAppWebControllerUserQuizIndex(organizationId));
	organizationQuizzesWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		return quizzes.reduce(addToState, state);
	});
	return quizzes;
}

export async function createQuiz(organizationId: number, params: QuizCreate) {
	const quiz = await load(UserService.quantuAppWebControllerUserQuizCreate(organizationId, params));
	organizationQuizzesWritable.update((state) => addToState(state, quiz));
	return quiz;
}

export async function updateQuiz(organizationId: number, id: number, params: Partial<Quiz>) {
	const quiz = await load(
		UserService.quantuAppWebControllerUserQuizUpdate(id, organizationId, params)
	);
	organizationQuizzesWritable.update((state) => addToState(state, quiz));
	return quiz;
}

export async function deleteQuiz(organizationId: number, id: number) {
	const quiz = get(organizationQuizzesWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserQuizDelete(quiz.id, organizationId));
	organizationQuizzesWritable.update((state) => deleteFromState(state, quiz));
}

function addToState(state: IOrganizationQuizzesStore, quiz: Quiz): IOrganizationQuizzesStore {
	const byOrganizationId =
		state.byOrganizationId[quiz.organizationId] ||
		(state.byOrganizationId[quiz.organizationId] = {});
	byOrganizationId[quiz.id] = quiz;
	state.byId[quiz.id] = quiz;
	return state;
}

function deleteFromState(state: IOrganizationQuizzesStore, quiz: Quiz): IOrganizationQuizzesStore {
	const byOrganizationId =
		state.byOrganizationId[quiz.organizationId] ||
		(state.byOrganizationId[quiz.organizationId] = {});
	delete byOrganizationId[quiz.id];
	delete state.byId[quiz.id];
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		organizationQuizzesWritable.set({
			byId: {},
			byOrganizationId: {}
		})
	);
}