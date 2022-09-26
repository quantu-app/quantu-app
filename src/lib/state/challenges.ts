import type { Challenge, Result } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import type { Answer, UserAnswers, OptionalResult } from '$lib/types';
import type { IFetch } from '../utils';
import { apiChallengesPath, apiDepartmentChallengePath, apiDepartmentChallengesPath, apiResultsChallengeExplainPath, apiResultsChallengePath } from '$lib/routingUtils';
import { addOrUpdate, resourceFromJSON } from './common';

export type StateChallenge = Challenge & UserAnswers & OptionalResult & {
	department: { url: string; name: string };
	solutions: number;
};

export const challengesWritable = writable<Array<StateChallenge>>([]);

export const challenges = derived(challengesWritable, (challenges) => challenges.slice());
export const challengesById = derived(challengesWritable, (challenges) =>
	challenges.reduce((byId, challenge) => {
		byId[challenge.id] = challenge;
		return byId;
	}, {} as { [id: string]: StateChallenge })
);
export const challengesByDepartmentUrl = derived(challengesWritable, (challenges) =>
	challenges.reduce((byDepartmentUrl, challenge) => {
		const parentStateChallenges =
			byDepartmentUrl[challenge.department.url] || (byDepartmentUrl[challenge.department.url] = {});
		parentStateChallenges[challenge.url] = challenge;
		return byDepartmentUrl;
	}, {} as { [departmentUrl: string]: { [url: string]: StateChallenge } })
);
export const challengesByDepartment = derived(challengesWritable, (challenges) =>
	challenges.reduce((state, challenge) => {
		const byDepartmentUrl =
			state[challenge.department.url] ||
			(state[challenge.department.url] = {
				url: challenge.department.url,
				name: challenge.department.name,
				challenges: []
			});
		byDepartmentUrl.challenges.push(challenge);
		return state;
	}, {} as { [departmentUrl: string]: { url: string; name: string; challenges: StateChallenge[] } })
);

export async function showChallengeByUrl(
	departmentUrl: string,
	url: string,
	fetchFn: IFetch = fetch
) {
	const cachedChallenge = (get(challengesByDepartmentUrl)[departmentUrl] || {})[url];
	if (cachedChallenge) {
		return cachedChallenge;
	}
	const res = await fetchFn(apiDepartmentChallengePath(departmentUrl, url), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: StateChallenge = resourceFromJSON<StateChallenge>(await res.json());
	challengesWritable.update((challenges) => addOrUpdate(challenges.slice(), challenge));
	return challenge;
}

export async function showChallenges(departmentUrl: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(apiDepartmentChallengesPath(departmentUrl), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<StateChallenge> = (await res.json()).map(resourceFromJSON<StateChallenge>);
	challengesWritable.update((state) =>
		challenges.reduce((state, challenge) => addOrUpdate(state, challenge), state.slice())
	);
	return challenges;
}

export async function showAllChallenges(fetchFn: IFetch = fetch) {
	const res = await fetchFn(apiChallengesPath(), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<StateChallenge> = (await res.json()).map(resourceFromJSON<StateChallenge>);
	challengesWritable.update((state) =>
		challenges.reduce((state, challenge) => addOrUpdate(state, challenge), state.slice())
	);
	return challenges;
}

export async function answer(challengeId: string, answer: Answer) {
	const res = await fetch(apiResultsChallengePath(challengeId), {
		method: 'POST',
		body: JSON.stringify(answer)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = resourceFromJSON<Result>(await res.json());
	challengesWritable.update((state) => {
		const index = state.findIndex((c) => c.id === result.challengeId);
		const challenge = state[index];
		if (challenge) {
			state = state.slice();
			let answers = challenge.answers;
			let solutions = challenge.solutions;
			if (challenge.result) {
				const prevResultIndex = answers.findIndex(
					(result) => challenge.result?.userId === result.userId
				);
				answers = answers.slice();
				if (prevResultIndex === -1) {
					solutions += 1;
					answers.push({ value: result.value, userId: result.userId });
				} else {
					answers[prevResultIndex] = { value: result.value, userId: result.userId };
				}
			}
			state[index] = { ...challenge, answers, solutions, result };
		}
		return state;
	});
	return result;
}

export async function explain(challengeId: string) {
	const res = await fetch(apiResultsChallengeExplainPath(challengeId), {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = resourceFromJSON<Result>(await res.json());
	challengesWritable.update((state) => {
		const index = state.findIndex((c) => c.id === result.challengeId);
		const challenge = state[index];
		if (challenge) {
			state = state.slice();
			let answers = challenge.answers;
			let solutions = challenge.solutions;
			if (challenge.result) {
				const prevResultIndex = challenge.answers.findIndex(
					(result) => challenge.result?.userId === result.userId
				);
				answers = challenge.answers.slice();
				if (prevResultIndex === -1) {
					solutions += 1;
					answers.push({ value: result.value, userId: result.userId });
				} else {
					answers[prevResultIndex] = { value: result.value, userId: result.userId };
				}
			}
			state[index] = { ...challenge, answers, solutions, result };
		}
		return state;
	});
	return result;
}
