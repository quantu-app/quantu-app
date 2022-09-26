import type { LessonBlock, Result } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { Answer, UserAnswers, OptionalResult } from '$lib/types';
import { addOrUpdate, resourceFromJSON } from './common';
import type { IFetch } from '../utils';
import { apiDepartmentCourseChapterLessonLessonBlockPath } from '$lib/routingUtils';

export type StateLessonBlock = LessonBlock &
	UserAnswers &
	OptionalResult & {
		lesson: {
			url: string;
			name: string;
			chapter: {
				url: string;
				name: string;
				course: { url: string; name: string; department: { url: string; name: string } };
			};
		};
	};

export const lessonBlocksWritable = writable<Array<StateLessonBlock>>([]);

export const lessonBlocks = derived(lessonBlocksWritable, (lessonBlocks) => lessonBlocks.slice());
export const lessonBlocksById = derived(lessonBlocksWritable, (lessonBlocks) =>
	lessonBlocks.reduce((byId, lessonBlock) => {
		byId[lessonBlock.id] = lessonBlock;
		return byId;
	}, {} as { [id: string]: StateLessonBlock })
);
export const lessonBlocksByUrl = derived(lessonBlocksWritable, (lessonBlocks) =>
	lessonBlocks.reduce((byUrl, lessonBlock) => {
		const byDepartmentUrl =
			byUrl[lessonBlock.lesson.chapter.course.department.url] ||
			(byUrl[lessonBlock.lesson.chapter.course.department.url] = {});
		const byCourseUrl =
			byDepartmentUrl[lessonBlock.lesson.chapter.course.url] ||
			(byDepartmentUrl[lessonBlock.lesson.chapter.course.url] = {});
		const byChapterUrl =
			byCourseUrl[lessonBlock.lesson.chapter.url] ||
			(byCourseUrl[lessonBlock.lesson.chapter.url] = {});
		const byLessonUrl =
			byChapterUrl[lessonBlock.lesson.url] || (byChapterUrl[lessonBlock.lesson.url] = {});

		byLessonUrl[lessonBlock.url] = lessonBlock;

		return byUrl;
	}, {} as { [departmentUrl: string]: { [courseUrl: string]: { [chapterUrl: string]: { [lessonUrl: string]: { [lessonBlockUrl: string]: StateLessonBlock } } } } })
);

export async function showLessonBlock(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	lessonBlockUrl: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		apiDepartmentCourseChapterLessonLessonBlockPath(
			departmentUrl,
			courseUrl,
			chapterUrl,
			lessonUrl,
			lessonBlockUrl
		),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const lessonBlock: StateLessonBlock = resourceFromJSON<StateLessonBlock>(await res.json());
	lessonBlocksWritable.update((state) => addOrUpdate(state.slice(), lessonBlock));
	return lessonBlock;
}

export async function showLessonBlocks(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/departments/${departmentUrl}/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${lessonUrl}/lesson-blocks`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const lessonBlocks: Array<StateLessonBlock> = (await res.json()).map(
		resourceFromJSON<StateLessonBlock>
	);
	lessonBlocksWritable.update((state) =>
		lessonBlocks.reduce((state, lessonBlock) => addOrUpdate(state, lessonBlock), state.slice())
	);
	return lessonBlocks;
}

export async function answer(lessonBlockId: string, answer: Answer) {
	const res = await fetch(`${base}/api/results/lesson-block/${lessonBlockId}`, {
		method: 'POST',
		body: JSON.stringify(answer)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = resourceFromJSON<Result>(await res.json());
	lessonBlocksWritable.update((state) => {
		const index = state.findIndex((c) => c.id === result.lessonBlockId);
		const lessonBlock = state[index];
		if (lessonBlock) {
			state = state.slice();
			let answers = lessonBlock.answers;
			if (lessonBlock.result) {
				const prevResultIndex = answers.findIndex(
					(result) => lessonBlock.result?.userId === result.userId
				);
				answers = answers.slice();
				if (prevResultIndex === -1) {
					answers.push({ value: result.value, userId: result.userId });
				} else {
					answers[prevResultIndex] = { value: result.value, userId: result.userId };
				}
			}
			state[index] = { ...lessonBlock, answers, result };
		}
		return state;
	});
	return result;
}

export async function explain(lessonBlockId: string) {
	const res = await fetch(`${base}/api/results/lesson-block/${lessonBlockId}/explain`, {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = resourceFromJSON<Result>(await res.json());
	lessonBlocksWritable.update((state) => {
		const index = state.findIndex((c) => c.id === result.lessonBlockId);
		const challenge = state[index];
		if (challenge) {
			state = state.slice();
			let answers = challenge.answers;
			if (challenge.result) {
				const prevResultIndex = challenge.answers.findIndex(
					(result) => challenge.result?.userId === result.userId
				);
				answers = challenge.answers.slice();
				if (prevResultIndex === -1) {
					answers.push({ value: result.value, userId: result.userId });
				} else {
					answers[prevResultIndex] = { value: result.value, userId: result.userId };
				}
			}
			state[index] = { ...challenge, answers, result };
		}
		return state;
	});
	return result;
}
