import { browser } from '$app/env';
import type { Lesson, LessonCreate, LessonUpdate } from '$lib/api/quantu-app-api';
import { UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IOrganizationLessonsStore {
	byId: { [id: number]: Lesson };
	byOrganizationId: {
		[organizationId: number]: { [id: number]: Lesson };
	};
	byUnitId: {
		[organizationId: number]: { [id: number]: Lesson };
	};
}

const organizationLessonsWritable = writable<IOrganizationLessonsStore>({
	byId: {},
	byOrganizationId: {},
	byUnitId: {}
});

export const organizationLessons: Readable<IOrganizationLessonsStore> = {
	subscribe: organizationLessonsWritable.subscribe
};

export async function getLesson(organizationId: number, id: number) {
	const cachedLesson = get(organizationLessons).byId[id];
	if (cachedLesson) {
		return cachedLesson;
	}
	const lesson = await load(UserService.quantuAppWebControllerUserLessonShow(id, organizationId));
	organizationLessonsWritable.update((state) => addToState(state, lesson));
	return lesson;
}

export async function getLessons(organizationId: number, unitId?: number, force = false) {
	if (!force) {
		if (unitId) {
			const cachedLessons = Object.values(get(organizationLessons).byUnitId[unitId] || {});
			if (cachedLessons.length) {
				return cachedLessons.filter((lesson) => lesson.organizationId === organizationId);
			}
		}
		if (organizationId) {
			const cachedLessons = Object.values(
				get(organizationLessons).byOrganizationId[organizationId] || {}
			);
			if (cachedLessons.length) {
				return cachedLessons;
			}
		}
	}
	const lessons = await load(
		UserService.quantuAppWebControllerUserLessonIndex(organizationId, unitId)
	);
	organizationLessonsWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		if (unitId) {
			state.byUnitId[unitId] = {};
		}
		return lessons.reduce(addToState, state);
	});
	return lessons;
}

export async function createLesson(organizationId: number, params: LessonCreate) {
	const lesson = await load(
		UserService.quantuAppWebControllerUserLessonCreate(organizationId, params)
	);
	organizationLessonsWritable.update((state) => addToState(state, lesson));
	return lesson;
}

export async function updateLesson(organizationId: number, id: number, params: LessonUpdate) {
	const lesson = await load(
		UserService.quantuAppWebControllerUserLessonUpdate(id, organizationId, params)
	);
	organizationLessonsWritable.update((state) => addToState(state, lesson));
	return lesson;
}

export async function deleteLesson(organizationId: number, id: number) {
	const lesson = get(organizationLessonsWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserLessonDelete(lesson.id, organizationId));
	organizationLessonsWritable.update((state) => deleteFromState(state, lesson));
}

function addToState(state: IOrganizationLessonsStore, lesson: Lesson): IOrganizationLessonsStore {
	const byOrganizationId =
		state.byOrganizationId[lesson.organizationId] ||
		(state.byOrganizationId[lesson.organizationId] = {});

	if (lesson.unitId) {
		const byUnitId = state.byUnitId[lesson.unitId] || (state.byUnitId[lesson.unitId] = {});
		byUnitId[lesson.id] = lesson;
		lesson = { ...lesson, unitId: null, index: null };
	}
	byOrganizationId[lesson.id] = lesson;
	state.byId[lesson.id] = lesson;
	return state;
}

function deleteFromState(
	state: IOrganizationLessonsStore,
	lesson: Lesson
): IOrganizationLessonsStore {
	const byOrganizationId =
		state.byOrganizationId[lesson.organizationId] ||
		(state.byOrganizationId[lesson.organizationId] = {});
	for (const lessons of Object.values(state.byUnitId || {})) {
		if (lesson.id in lessons) {
			delete lessons[lesson.id];
		}
	}
	delete byOrganizationId[lesson.id];
	delete state.byId[lesson.id];
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		organizationLessonsWritable.set({
			byId: {},
			byUnitId: {},
			byOrganizationId: {}
		})
	);
}
