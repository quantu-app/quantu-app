import type { Chapter } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '../utils';

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
) {
	const cachedChapter = ((get(chaptersByUrl)[departmentUrl] || {})[courseUrl] || {})[url];
	if (cachedChapter) {
		return cachedChapter;
	}
	const res = await fetchFn(
		`${base}/api/departments/${departmentUrl}/courses/${courseUrl}/chapters/${url}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const chapter: StateChapter = chapterFromJSON(await res.json());
	chaptersWritable.update((chapters) => addOrUpdate(chapters.slice(), chapter));
	return chapter;
}

export async function showChapters(
	departmentUrl: string,
	courseUrl: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/departments/${departmentUrl}/courses/${courseUrl}/chapters`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const chapters: Array<StateChapter> = (await res.json()).map(chapterFromJSON);
	chaptersWritable.update((state) =>
		chapters.reduce((state, chapter) => addOrUpdate(state, chapter), state.slice())
	);
	return chapters;
}

function addOrUpdate(state: Array<StateChapter>, chapter: StateChapter): Array<StateChapter> {
	const index = state.findIndex((c) => c.id === chapter.id);
	if (index === -1) {
		state.push(chapter);
	} else {
		state[index] = chapter;
	}
	return state;
}

export function chapterFromJSON(chapter: StateChapter): StateChapter {
	return {
		...chapter,
		releasedAt: chapter.releasedAt ? new Date(chapter.releasedAt) : chapter.releasedAt,
		createdAt: new Date(chapter.createdAt),
		updatedAt: new Date(chapter.updatedAt)
	};
}
