import type { Result, ResultType } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { Answer } from '$lib/types';

const resultsWritable = writable<Result[]>([]);

export const resultsById = derived(resultsWritable, (results) =>
	results.reduce((byId, result) => {
		byId[result.id] = result;
		return byId;
	}, {} as { [id: string]: Result })
);
export const resultsByTypeAndQuestionId = derived(resultsWritable, (results) =>
	results.reduce((byType, result) => {
		const byQuestionId = byType[result.resultType] || (byType[result.resultType] = {});
		byQuestionId[result.questionId] = result;
		return byType;
	}, {} as { [resultType: string]: { [id: string]: Result } })
);

export async function showResultByTypeAndQuestionId(type: ResultType, questionId: string) {
	const res = await fetch(`${base}/api/results/${type.toLowerCase()}/${questionId}`);
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = await res.json();
	resultsWritable.update((state) => addOrUpdate(state, result));
	return result;
}

export async function answer(type: ResultType, questionId: string, answer: Answer) {
	const res = await fetch(`${base}/api/results/${type.toLowerCase()}/${questionId}`, {
		method: 'POST',
		body: JSON.stringify(answer)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = await res.json();
	resultsWritable.update((state) => addOrUpdate(state, result));
	return result;
}

function addOrUpdate(state: Result[], result: Result) {
	const index = state.findIndex((t) => t.id === result.id);
	if (index === -1) {
		state.push(result);
	} else {
		state[index] = result;
	}
	return state;
}
