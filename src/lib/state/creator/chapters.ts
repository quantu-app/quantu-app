import type { Chapter } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import { sortByIndex, type IFetch } from '$lib/utils';

export type StateChapter = Chapter & {
	logo?: {
		name: string;
	};
	course: {
		id: string;
		url: string;
		name: string;
		department: { id: string; url: string; name: string };
	};
};

const chaptersWritable = writable<Array<StateChapter>>([]);

export const chapters = derived(chaptersWritable, (chapters) => chapters);

export const chaptersById = derived(chaptersWritable, (chapters) =>
	chapters.reduce((byId, chapter) => {
		byId[chapter.id] = chapter;
		return byId;
	}, {} as { [id: string]: StateChapter })
);
export const chaptersByCourseId = derived(chaptersWritable, (chapters) => {
	const state = chapters.reduce((byParentId, chapter) => {
		const parentStateChapters = byParentId[chapter.courseId] || (byParentId[chapter.courseId] = []);
		parentStateChapters.push(chapter);
		return byParentId;
	}, {} as { [courseId: string]: Array<StateChapter> });
	Object.values(state).forEach((byParentId) => {
		byParentId.sort(sortByIndex);
	});
	return state;
});

export async function showChapterById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/chapters/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const chapter: StateChapter = chapterFromJSON(await res.json());
	chaptersWritable.update((state) => addOrUpdate(state.slice(), chapter));
	return chapter;
}

export async function validChapterUrl(departmentUrl: string, courseUrl: string, url: string) {
	const res = await fetch(
		`${base}/api/departments/${departmentUrl}/courses/${courseUrl}/chapters/${url}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		return true;
	} else {
		return false;
	}
}

export async function showChapters(courseId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/courses/${courseId}/chapters`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const chapters: Array<StateChapter> = (await res.json()).map(chapterFromJSON);
	chaptersWritable.update((state) =>
		chapters.reduce((state, chapter) => addOrUpdate(state, chapter), state.slice())
	);
	return chapters;
}

export async function createChapter(courseId: string, body: Partial<StateChapter>) {
	const res = await fetch(`${base}/api/creator/courses/${courseId}/chapters`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const chapter: StateChapter = chapterFromJSON(await res.json());
	chaptersWritable.update((state) => addOrUpdate(state.slice(), chapter));
	return chapter;
}

export async function updateChapter(id: string, body: Partial<StateChapter>) {
	const res = await fetch(`${base}/api/creator/chapters/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const chapter: StateChapter = chapterFromJSON(await res.json());
	chaptersWritable.update((state) => addOrUpdate(state.slice(), chapter));
	return chapter;
}

export async function sortChapters(newOrder: { id: string; index: number }[]) {
	const res = await fetch(`${base}/api/creator/chapters/sort`, {
		method: 'PATCH',
		body: JSON.stringify(newOrder)
	});
	if (!res.ok) {
		throw await res.json();
	}
	chaptersWritable.update((state) => {
		state = state.slice();

		for (const { id, index } of newOrder) {
			const i = state.findIndex((chapter) => chapter.id === id);

			if (i !== -1) {
				state[i] = { ...state[i], index };
			}
		}

		return state;
	});
}

export async function deleteChapter(id: string) {
	const res = await fetch(`${base}/api/creator/chapters/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	chaptersWritable.update((state) => {
		const index = state.findIndex((chapter) => chapter.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
			for (let i = 0; i < state.length; i++) {
				state[i] = { ...state[i], index: i };
			}
		}
		return state;
	});
}

function addOrUpdate(chapters: StateChapter[], chapter: StateChapter): StateChapter[] {
	const index = chapters.findIndex((t) => t.id === chapter.id);
	if (index === -1) {
		chapters.push(chapter);
	} else {
		chapters[index] = chapter;
	}
	return chapters;
}

function chapterFromJSON(chapter: StateChapter): StateChapter {
	return {
		...chapter,
		releasedAt: chapter.releasedAt ? new Date(chapter.releasedAt) : null,
		createdAt: new Date(chapter.createdAt),
		updatedAt: new Date(chapter.updatedAt)
	};
}
