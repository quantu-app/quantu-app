import { browser } from '$app/env';
import type { Lesson } from '$lib/api/quantu-app-api';
import { LessonService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface ILessonsStore {
	byId: { [id: number]: Lesson };
	byUnitId: { [unitId: number]: { [id: number]: Lesson } };
	byOrganizationId: { [organizationId: number]: { [id: number]: Lesson } };
}

const lessonsWritable = writable<ILessonsStore>({
	byId: {},
	byUnitId: {},
	byOrganizationId: {}
});

export const lessons: Readable<ILessonsStore> = {
	subscribe: lessonsWritable.subscribe
};

export async function getLesson(id: number) {
	const cachedLesson = get(lessons).byId[id];
	if (cachedLesson) {
		return cachedLesson;
	}
	const lesson = await load(LessonService.quantuAppWebControllerLessonShow(id));
	lessonsWritable.update((state) => addToState(state, lesson));
	return lesson;
}

export async function getLessons(organizationId?: number, unitId?: number, force = true) {
	if (!force) {
		if (unitId) {
			const cachedUnits = Object.values(get(lessonsWritable).byUnitId[unitId] || {});
			if (cachedUnits.length) {
				if (organizationId) {
					return cachedUnits.filter((unit) => unit.organizationId === organizationId);
				} else {
					return cachedUnits;
				}
			}
		} else if (organizationId) {
			const cachedLessons = Object.values(
				get(lessonsWritable).byOrganizationId[organizationId] || {}
			);
			if (cachedLessons.length) {
				return cachedLessons;
			}
		} else {
			const cachedLessons = Object.values(get(lessonsWritable).byId || {});
			if (cachedLessons.length) {
				return cachedLessons;
			}
		}
	}
	const lessons = await load(LessonService.quantuAppWebControllerLessonIndex(organizationId));
	lessonsWritable.update((state) => lessons.reduce(addToState, state));
	return lessons;
}

function addToState(state: ILessonsStore, lesson: Lesson): ILessonsStore {
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

if (browser) {
	userEmitter.on('signOut', () =>
		lessonsWritable.set({
			byId: {},
			byUnitId: {},
			byOrganizationId: {}
		})
	);
}
