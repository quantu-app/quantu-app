import type { Course } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

export type StateCourse = Course & {
	department: { url: string; name: string };
};

const coursesWritable = writable<Array<StateCourse>>([]);

export const courses = derived(coursesWritable, (courses) => courses);

export const coursesById = derived(coursesWritable, (courses) =>
	courses.reduce((byId, course) => {
		byId[course.id] = course;
		return byId;
	}, {} as { [id: string]: StateCourse })
);
export const coursesByDepartmentId = derived(coursesWritable, (courses) =>
	courses.reduce((byParentId, course) => {
		const parentStateCourses =
			byParentId[course.departmentId] || (byParentId[course.departmentId] = []);
		parentStateCourses.push(course);
		return byParentId;
	}, {} as { [departmentId: string]: Array<StateCourse> })
);

export async function showCourseById(departmentId: string, id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/courses/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const course: StateCourse = courseFromJSON(await res.json());
	coursesWritable.update((state) => addOrUpdate(state.slice(), course));
	return course;
}

export async function validCourseUrl(departmentUrl: string, url: string) {
	const res = await fetch(`${base}/api/departments/${departmentUrl}/courses/${url}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		return true;
	} else {
		return false;
	}
}

export async function showCourses(departmentId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/departments/${departmentId}/courses`, {
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

export async function createCourse(departmentId: string, body: Partial<StateCourse>) {
	const res = await fetch(`${base}/api/creator/departments/${departmentId}/courses`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const course: StateCourse = courseFromJSON(await res.json());
	coursesWritable.update((state) => addOrUpdate(state.slice(), course));
	return course;
}

export async function updateCourse(id: string, body: Partial<StateCourse>) {
	const res = await fetch(`${base}/api/creator/courses/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const course: StateCourse = courseFromJSON(await res.json());
	coursesWritable.update((state) => addOrUpdate(state.slice(), course));
	return course;
}

export async function deleteCourse(id: string) {
	const res = await fetch(`${base}/api/creator/courses/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	coursesWritable.update((state) => {
		const index = state.findIndex((course) => course.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(courses: StateCourse[], course: StateCourse): StateCourse[] {
	const index = courses.findIndex((t) => t.id === course.id);
	if (index === -1) {
		courses.push(course);
	} else {
		courses[index] = course;
	}
	return courses;
}

function courseFromJSON(course: StateCourse): StateCourse {
	return {
		...course,
		releasedAt: course.releasedAt ? new Date(course.releasedAt) : null,
		createdAt: new Date(course.createdAt),
		updatedAt: new Date(course.updatedAt)
	};
}
