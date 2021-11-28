import { browser } from '$app/env';
import type { Course } from '$lib/api/quantu-app-api';
import { CourseService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface ICoursesStore {
	byId: { [id: number]: Course };
	byOrganizationId: { [organizationId: number]: { [id: number]: Course } };
}

const coursesWritable = writable<ICoursesStore>({
	byId: {},
	byOrganizationId: {}
});

export const courses: Readable<ICoursesStore> = {
	subscribe: coursesWritable.subscribe
};

export async function getCourse(id: number) {
	const cachedCourse = get(courses).byId[id];
	if (cachedCourse) {
		return cachedCourse;
	}
	const course = await load(CourseService.quantuAppWebControllerCourseShow(id));
	coursesWritable.update((state) => addToState(state, course));
	return course;
}

export async function getCourses(organizationId?: number, force = true) {
	if (!force) {
		if (organizationId) {
			const cachedCourses = Object.values(
				get(coursesWritable).byOrganizationId[organizationId] || {}
			);
			if (cachedCourses.length) {
				return cachedCourses;
			}
		} else {
			const cachedCourses = Object.values(get(coursesWritable).byId || {});
			if (cachedCourses.length) {
				return cachedCourses;
			}
		}
	}
	const courses = await load(CourseService.quantuAppWebControllerCourseIndex(organizationId));
	coursesWritable.update((state) => courses.reduce(addToState, state));
	return courses;
}

function addToState(state: ICoursesStore, course: Course): ICoursesStore {
	const byOrganizationId =
		state.byOrganizationId[course.organizationId] ||
		(state.byOrganizationId[course.organizationId] = {});
	byOrganizationId[course.id] = course;
	state.byId[course.id] = course;
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		coursesWritable.set({
			byId: {},
			byOrganizationId: {}
		})
	);
}
