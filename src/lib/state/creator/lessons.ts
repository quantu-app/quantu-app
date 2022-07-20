import type { Lesson } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

export type StateLesson = Lesson & {
	chapter: { url: string; name: string };
};

const lessonsWritable = writable<Array<StateLesson>>([]);

export const lessons = derived(lessonsWritable, (lessons) => lessons);

export const lessonsById = derived(lessonsWritable, (lessons) =>
	lessons.reduce((byId, lesson) => {
		byId[lesson.id] = lesson;
		return byId;
	}, {} as { [id: string]: StateLesson })
);
export const lessonsByChapterId = derived(lessonsWritable, (lessons) =>
	lessons.reduce((byParentId, lesson) => {
		const parentStateLessons = byParentId[lesson.chapterId] || (byParentId[lesson.chapterId] = []);
		parentStateLessons.push(lesson);
		return byParentId;
	}, {} as { [chapterId: string]: Array<StateLesson> })
);

export async function showLessonById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/lessons/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lesson: StateLesson = lessonFromJSON(await res.json());
	lessonsWritable.update((state) => addOrUpdate(state.slice(), lesson));
	return lesson;
}

export async function validLessonUrl(courseUrl: string, chapterUrl: string, url: string) {
	const res = await fetch(
		`${base}/api/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${url}`,
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

export async function showLessons(chapterId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/chapters/${chapterId}/lessons`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lessons: Array<StateLesson> = (await res.json()).map(lessonFromJSON);
	lessonsWritable.update((state) =>
		lessons.reduce((state, lesson) => addOrUpdate(state, lesson), state.slice())
	);
	return lessons;
}

export async function createLesson(chapterId: string, body: Partial<StateLesson>) {
	const res = await fetch(`${base}/api/creator/chapters/${chapterId}/lessons`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lesson: StateLesson = lessonFromJSON(await res.json());
	lessonsWritable.update((state) => addOrUpdate(state.slice(), lesson));
	return lesson;
}

export async function updateLesson(id: string, body: Partial<StateLesson>) {
	const res = await fetch(`${base}/api/creator/lessons/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lesson: StateLesson = lessonFromJSON(await res.json());
	lessonsWritable.update((state) => addOrUpdate(state.slice(), lesson));
	return lesson;
}

export async function deleteLesson(id: string) {
	const res = await fetch(`${base}/api/creator/lessons/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	lessonsWritable.update((state) => {
		const index = state.findIndex((lesson) => lesson.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(lessons: StateLesson[], lesson: StateLesson): StateLesson[] {
	const index = lessons.findIndex((t) => t.id === lesson.id);
	if (index === -1) {
		lessons.push(lesson);
	} else {
		lessons[index] = lesson;
	}
	return lessons;
}

function lessonFromJSON(lesson: StateLesson): StateLesson {
	return {
		...lesson,
		releasedAt: lesson.releasedAt ? new Date(lesson.releasedAt) : null,
		createdAt: new Date(lesson.createdAt),
		updatedAt: new Date(lesson.updatedAt)
	};
}
