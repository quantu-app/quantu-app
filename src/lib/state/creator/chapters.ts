import type { Chapter } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

export type StateChapter = Chapter & {
	logo?: {
		name: string;
	};
	course: { url: string; name: string; department: { url: string; name: string } };
};

const chaptersWritable = writable<Array<StateChapter>>([]);

export const chapters = derived(chaptersWritable, (chapters) => chapters);

export const chaptersById = derived(chaptersWritable, (chapters) =>
	chapters.reduce((byId, chapter) => {
		byId[chapter.id] = chapter;
		return byId;
	}, {} as { [id: string]: StateChapter })
);
export const chaptersByCourseId = derived(chaptersWritable, (chapters) =>
	chapters.reduce((byParentId, chapter) => {
		const parentStateChapters = byParentId[chapter.courseId] || (byParentId[chapter.courseId] = []);
		parentStateChapters.push(chapter);
		return byParentId;
	}, {} as { [courseId: string]: Array<StateChapter> })
);

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

export async function validChapterUrl(courseUrl: string, url: string) {
	const res = await fetch(`${base}/api/courses/${courseUrl}/chapters/${url}`, {
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
