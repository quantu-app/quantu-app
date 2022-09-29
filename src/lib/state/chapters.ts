import type { Chapter } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { JSON_HEADERS, type IFetch } from '../utils';
import { addOrUpdate, resourceFromJSON } from './common';
import { apiDepartmentCourseChapterPath, apiDepartmentCourseChaptersPath } from '$lib/routingUtils';

export type StateChapter = Chapter & {
	course: { url: string; name: string; department: { url: string; name: string } };
};

export const chaptersWritable = writable<Array<StateChapter>>([]);

export const chapters = derived(chaptersWritable, (chapters) => chapters.slice());
export const chaptersById = derived(chaptersWritable, (chapters) =>
	chapters.reduce((byId, chapter) => {
		byId[chapter.id] = chapter;
		return byId;
	}, {} as { [id: string]: StateChapter })
);
export const chaptersByUrl = derived(chaptersWritable, (chapters) =>
	chapters.reduce((byUrl, chapter) => {
		const byDepartmentUrl =
			byUrl[chapter.course.department.url] || (byUrl[chapter.course.department.url] = {});
		const byCourseUrl =
			byDepartmentUrl[chapter.course.url] || (byDepartmentUrl[chapter.course.url] = {});
		byCourseUrl[chapter.url] = chapter;
		return byUrl;
	}, {} as { [departmentUrl: string]: { [courseUrl: string]: { [url: string]: StateChapter } } })
);

export async function showChapterByUrl(
	departmentUrl: string,
	courseUrl: string,
	url: string,
	fetchFn: IFetch = fetch
): Promise<StateChapter> {
	const cachedChapter = ((get(chaptersByUrl)[departmentUrl] || {})[courseUrl] || {})[url];
	if (cachedChapter) {
		return cachedChapter;
	}
	const res = await fetchFn(apiDepartmentCourseChapterPath(departmentUrl, courseUrl, url), {
		headers: JSON_HEADERS
	});
	if (!res.ok) {
		throw await res.json();
	}
	const chapter: StateChapter = resourceFromJSON(await res.json());
	chaptersWritable.update((chapters) => addOrUpdate(chapters.slice(), chapter));
	return chapter;
}

export async function showChapters(
	departmentUrl: string,
	courseUrl: string,
	fetchFn: IFetch = fetch
): Promise<StateChapter[]> {
	const res = await fetchFn(apiDepartmentCourseChaptersPath(departmentUrl, courseUrl), {
		headers: JSON_HEADERS
	});
	if (!res.ok) {
		throw await res.json();
	}
	const chapters: Array<StateChapter> = (await res.json()).map(resourceFromJSON<StateChapter>);
	chaptersWritable.update((state) =>
		chapters.reduce((state, chapter) => addOrUpdate(state, chapter), state.slice())
	);
	return chapters;
}
