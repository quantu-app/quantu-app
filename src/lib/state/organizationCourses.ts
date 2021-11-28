import { browser } from '$app/env';
import type { Course, CourseCreate } from '$lib/api/quantu-app-api';
import { UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IOrganizationCoursesStore {
	byId: { [id: number]: Course };
	byOrganizationId: {
		[organizationId: number]: { [id: number]: Course };
	};
}

const organizationCoursesWritable = writable<IOrganizationCoursesStore>({
	byId: {},
	byOrganizationId: {}
});

export const organizationCourses: Readable<IOrganizationCoursesStore> = {
	subscribe: organizationCoursesWritable.subscribe
};

export async function getCourse(organizationId: number, id: number) {
	const cachedCourse = get(organizationCourses).byId[id];
	if (cachedCourse) {
		return cachedCourse;
	}
	const course = await load(UserService.quantuAppWebControllerUserCourseShow(id, organizationId));
	organizationCoursesWritable.update((state) => addToState(state, course));
	return course;
}

export async function getCourses(organizationId: number, force = false) {
	if (!force) {
		if (organizationId) {
			const cachedCourses = Object.values(
				get(organizationCoursesWritable).byOrganizationId[organizationId] || {}
			);
			if (cachedCourses.length) {
				return cachedCourses;
			}
		}
	}
	const courses = await load(UserService.quantuAppWebControllerUserCourseIndex(organizationId));
	organizationCoursesWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		return courses.reduce(addToState, state);
	});
	return courses;
}

export async function createCourse(organizationId: number, params: CourseCreate) {
	const course = await load(
		UserService.quantuAppWebControllerUserCourseCreate(organizationId, params)
	);
	organizationCoursesWritable.update((state) => addToState(state, course));
	return course;
}

export async function updateCourse(organizationId: number, id: number, params: Partial<Course>) {
	const course = await load(
		UserService.quantuAppWebControllerUserCourseUpdate(id, organizationId, params)
	);
	organizationCoursesWritable.update((state) => addToState(state, course));
	return course;
}

export async function deleteCourse(organizationId: number, id: number) {
	const course = get(organizationCoursesWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserCourseDelete(course.id, organizationId));
	organizationCoursesWritable.update((state) => deleteFromState(state, course));
}

function addToState(state: IOrganizationCoursesStore, course: Course): IOrganizationCoursesStore {
	const byOrganizationId =
		state.byOrganizationId[course.organizationId] ||
		(state.byOrganizationId[course.organizationId] = {});
	byOrganizationId[course.id] = course;
	state.byId[course.id] = course;
	return state;
}

function deleteFromState(
	state: IOrganizationCoursesStore,
	course: Course
): IOrganizationCoursesStore {
	const byOrganizationId =
		state.byOrganizationId[course.organizationId] ||
		(state.byOrganizationId[course.organizationId] = {});
	delete byOrganizationId[course.id];
	delete state.byId[course.id];
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		organizationCoursesWritable.set({
			byId: {},
			byOrganizationId: {}
		})
	);
}
