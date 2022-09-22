import type { Lesson } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import type { IFetch } from '../utils';
import { resourceFromJSON, addOrUpdate } from './common';
import { apiDepartmentCourseChapterLessonPath, apiDepartmentCourseChapterLessonsPath } from '$lib/routingUtils';

export type StateLesson = Lesson & {
	lessonBlocksCount: number;
	chapter: {
		url: string;
		name: string;
		course: { url: string; name: string; department: { url: string; name: string } };
	};
};

export const lessonsWritable = writable<Array<StateLesson>>([]);

export const lessons = derived(lessonsWritable, (lessons) => lessons.slice());
export const lessonsById = derived(lessonsWritable, (lessons) =>
	lessons.reduce((byId, lesson) => {
		byId[lesson.id] = lesson;
		return byId;
	}, {} as { [id: string]: StateLesson })
);
export const lessonsByUrl = derived(lessonsWritable, (lessons) =>
	lessons.reduce((byUrl, lesson) => {
		const byDepartmentUrl =
			byUrl[lesson.chapter.course.department.url] ||
			(byUrl[lesson.chapter.course.department.url] = {});
		const byCourseUrl =
			byDepartmentUrl[lesson.chapter.course.url] ||
			(byDepartmentUrl[lesson.chapter.course.url] = {});
		const byChapterUrl = byCourseUrl[lesson.chapter.url] || (byCourseUrl[lesson.chapter.url] = {});
		byChapterUrl[lesson.url] = lesson;
		return byUrl;
	}, {} as { [departmentUrl: string]: { [courseUrl: string]: { [chapterUrl: string]: { [url: string]: StateLesson } } } })
);

export async function showLessonByUrl(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	url: string,
	fetchFn: IFetch = fetch
) {
	const cachedLesson = (((get(lessonsByUrl)[departmentUrl] || {})[courseUrl] || {})[chapterUrl] ||
		{})[url];
	if (cachedLesson) {
		return cachedLesson;
	}
	const res = await fetchFn(
		apiDepartmentCourseChapterLessonPath(departmentUrl, courseUrl, chapterUrl, url),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const lesson: StateLesson = resourceFromJSON<StateLesson>(await res.json());
	lessonsWritable.update((lessons) => addOrUpdate(lessons.slice(), lesson));
	return lesson;
}

export async function showLessons(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		apiDepartmentCourseChapterLessonsPath(departmentUrl, courseUrl, chapterUrl),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const lessons: Array<StateLesson> = (await res.json()).map(resourceFromJSON<StateLesson>);
	lessonsWritable.update((state) =>
		lessons.reduce((state, lesson) => addOrUpdate(state, lesson), state.slice())
	);
	return lessons;
}