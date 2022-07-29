import type { LessonBlock } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '../utils';

export type StateLessonBlock = LessonBlock & {
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
			byChapterUrl[lessonBlock.lesson.url] || (byChapterUrl[lessonBlock.lesson.url] = []);
		byLessonUrl.push(lessonBlock);
		return byUrl;
	}, {} as { [departmentUrl: string]: { [courseUrl: string]: { [chapterUrl: string]: { [lessonId: string]: StateLessonBlock[] } } } })
);

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
	const lessonBlocks: Array<StateLessonBlock> = (await res.json()).map(lessonBlockFromJSON);
	lessonBlocksWritable.update((state) =>
		lessonBlocks.reduce((state, lessonBlock) => addOrUpdate(state, lessonBlock), state.slice())
	);
	return lessonBlocks;
}

function addOrUpdate(
	state: Array<StateLessonBlock>,
	lessonBlock: StateLessonBlock
): Array<StateLessonBlock> {
	const index = state.findIndex((c) => c.id === lessonBlock.id);
	if (index === -1) {
		state.push(lessonBlock);
	} else {
		state[index] = lessonBlock;
	}
	return state;
}

export function lessonBlockFromJSON(lessonBlock: StateLessonBlock): StateLessonBlock {
	return {
		...lessonBlock,
		releasedAt: lessonBlock.releasedAt ? new Date(lessonBlock.releasedAt) : lessonBlock.releasedAt,
		createdAt: new Date(lessonBlock.createdAt),
		updatedAt: new Date(lessonBlock.updatedAt)
	};
}
