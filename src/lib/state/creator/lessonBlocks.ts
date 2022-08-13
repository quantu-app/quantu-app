import type { LessonBlock } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import { sortByIndex, type IFetch } from '$lib/utils';

export type StateLessonBlock = LessonBlock & {
	lesson: {
		id: string;
		index: number;
		url: string;
		name: string;
		chapter: {
			id: string;
			index: number;
			url: string;
			name: string;
			course: { url: string; name: string; department: { id: string; url: string; name: string } };
		};
	};
};

const lessonBlocksWritable = writable<Array<StateLessonBlock>>([]);

export const lessonBlocks = derived(lessonBlocksWritable, (lessonBlocks) => lessonBlocks);

export const lessonBlocksById = derived(lessonBlocksWritable, (lessonBlocks) =>
	lessonBlocks.reduce((byId, lessonBlock) => {
		byId[lessonBlock.id] = lessonBlock;
		return byId;
	}, {} as { [id: string]: StateLessonBlock })
);
export const lessonBlocksByLessonId = derived(lessonBlocksWritable, (lessonBlocks) => {
	const state = lessonBlocks.reduce((byParentId, lessonBlock) => {
		const parentStateLessonBlocks =
			byParentId[lessonBlock.lessonId] || (byParentId[lessonBlock.lessonId] = []);
		parentStateLessonBlocks.push(lessonBlock);
		return byParentId;
	}, {} as { [lessonId: string]: Array<StateLessonBlock> });
	Object.values(state).forEach((byParentId) => {
		byParentId.sort(sortByIndex);
	});
	return state;
});

export async function showLessonBlockById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/lesson-blocks/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lessonBlock: StateLessonBlock = lessonBlockFromJSON(await res.json());
	lessonBlocksWritable.update((state) => addOrUpdate(state.slice(), lessonBlock));
	return lessonBlock;
}

export async function validLessonBlockUrl(
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	url: string
) {
	const res = await fetch(
		`${base}/api/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${lessonUrl}/lesson-blocks/${url}`,
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

export async function showLessonBlocks(lessonId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/lessons/${lessonId}/lesson-blocks`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lessonBlocks: Array<StateLessonBlock> = (await res.json()).map(lessonBlockFromJSON);
	lessonBlocksWritable.update((state) =>
		lessonBlocks.reduce((state, lessonBlock) => addOrUpdate(state, lessonBlock), state.slice())
	);
	return lessonBlocks;
}

export async function createLessonBlock(lessonId: string, body: Partial<StateLessonBlock>) {
	const res = await fetch(`${base}/api/creator/lessons/${lessonId}/lesson-blocks`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lessonBlock: StateLessonBlock = lessonBlockFromJSON(await res.json());
	lessonBlocksWritable.update((state) => addOrUpdate(state.slice(), lessonBlock));
	return lessonBlock;
}

export async function updateLessonBlock(id: string, body: Partial<StateLessonBlock>) {
	const res = await fetch(`${base}/api/creator/lesson-blocks/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const lessonBlock: StateLessonBlock = lessonBlockFromJSON(await res.json());
	if (body.description) {
		lessonBlock.description = body.description;
	}
	if (body.prompt) {
		lessonBlock.prompt = body.prompt;
	}
	lessonBlocksWritable.update((state) => addOrUpdate(state.slice(), lessonBlock));
	return lessonBlock;
}

export async function sortLessonBlocks(newOrder: { id: string; index: number }[]) {
	const res = await fetch(`${base}/api/creator/lesson-blocks/sort`, {
		method: 'PATCH',
		body: JSON.stringify(newOrder)
	});
	if (!res.ok) {
		throw await res.json();
	}
	lessonBlocksWritable.update((state) => {
		state = state.slice();

		for (const { id, index } of newOrder) {
			const i = state.findIndex((lessonBlock) => lessonBlock.id === id);

			if (i !== -1) {
				state[i] = { ...state[i], index };
			}
		}

		return state;
	});
}

export async function deleteLessonBlock(id: string) {
	const res = await fetch(`${base}/api/creator/lesson-blocks/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	lessonBlocksWritable.update((state) => {
		const index = state.findIndex((lessonBlock) => lessonBlock.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(
	lessonBlocks: StateLessonBlock[],
	lessonBlock: StateLessonBlock
): StateLessonBlock[] {
	const index = lessonBlocks.findIndex((t) => t.id === lessonBlock.id);
	if (index === -1) {
		lessonBlocks.push(lessonBlock);
	} else {
		lessonBlocks[index] = lessonBlock;
	}
	return lessonBlocks;
}

function lessonBlockFromJSON(lessonBlock: StateLessonBlock): StateLessonBlock {
	return {
		...lessonBlock,
		createdAt: new Date(lessonBlock.createdAt),
		updatedAt: new Date(lessonBlock.updatedAt)
	};
}
