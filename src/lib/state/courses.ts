import type { Course } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '../utils';

export type StateCourse = Course & {
	lessons: number;
	result: number;
	finished: boolean;
	department: { url: string; name: string };
};

export const coursesWritable = writable<Array<StateCourse>>([]);

export const courses = derived(coursesWritable, (courses) => courses.slice());
export const coursesById = derived(coursesWritable, (courses) =>
	courses.reduce((byId, course) => {
		byId[course.id] = course;
		return byId;
	}, {} as { [id: string]: StateCourse })
);
export const coursesByUrl = derived(coursesWritable, (courses) =>
	courses.reduce((byUrl, course) => {
		const byDepartmentUrl = byUrl[course.department.url] || (byUrl[course.department.url] = {});
		byDepartmentUrl[course.url] = course;
		return byUrl;
	}, {} as { [departmentUrl: string]: { [url: string]: StateCourse } })
);
export const coursesByDepartment = derived(coursesWritable, (courses) =>
	courses.reduce((state, course) => {
		const byDepartmentUrl =
			state[course.department.url] ||
			(state[course.department.url] = {
				url: course.department.url,
				name: course.department.name,
				courses: []
			});
		byDepartmentUrl.courses.push(course);
		return state;
	}, {} as { [departmentUrl: string]: { url: string; name: string; courses: StateCourse[] } })
);

export async function showCourseByUrl(departmentUrl: string, url: string, fetchFn: IFetch = fetch) {
	const cachedCourse = (get(coursesByUrl)[departmentUrl] || {})[url];
	if (cachedCourse) {
		return cachedCourse;
	}
	const res = await fetchFn(`${base}/api/departments/${departmentUrl}/courses/${url}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const course: StateCourse = courseFromJSON(await res.json());
	coursesWritable.update((courses) => addOrUpdate(courses.slice(), course));
	return course;
}

export async function showCourses(departmentUrl: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/departments/${departmentUrl}/courses`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const courses: Array<StateCourse> = (await res.json()).map(courseFromJSON);
	coursesWritable.update((state) =>
		courses.reduce((state, course) => addOrUpdate(state, course), state.slice())
	);
	return courses;
}

export async function showAllCourses(fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/courses`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const courses: Array<StateCourse> = (await res.json()).map(courseFromJSON);
	coursesWritable.update((state) =>
		courses.reduce((state, course) => addOrUpdate(state, course), state.slice())
	);
	return courses;
}

function addOrUpdate(state: Array<StateCourse>, course: StateCourse): Array<StateCourse> {
	const index = state.findIndex((c) => c.id === course.id);
	if (index === -1) {
		state.push(course);
	} else {
		state[index] = course;
	}
	return state;
}

export function courseFromJSON(course: StateCourse): StateCourse {
	return {
		...course,
		releasedAt: course.releasedAt ? new Date(course.releasedAt) : course.releasedAt,
		createdAt: new Date(course.createdAt),
		updatedAt: new Date(course.updatedAt)
	};
}
