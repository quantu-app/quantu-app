import type { Challenge, Result } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { Answer } from '$lib/types';
import type { IFetch } from '../utils';

export type StateChallenge = Challenge & {
	department: { url: string; name: string };
	result?: Result;
	answers: number[];
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
	const res = await fetchFn(`${base}/api/departments/${departmentUrl}/challenges/${url}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: StateChallenge = challengeFromJSON(await res.json());
	challengesWritable.update((challenges) => addOrUpdate(challenges.slice(), challenge));
	return challenge;
}

export async function showChallenges(departmentUrl: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/departments/${departmentUrl}/challenges`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<StateChallenge> = (await res.json()).map(challengeFromJSON);
	challengesWritable.update((state) =>
		challenges.reduce((state, challenge) => addOrUpdate(state, challenge), state.slice())
	);
	return challenges;
}

export async function showAllChallenges(fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/challenges`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<StateChallenge> = (await res.json()).map(challengeFromJSON);
	challengesWritable.update((state) =>
		challenges.reduce((state, challenge) => addOrUpdate(state, challenge), state.slice())
	);
	return challenges;
}

export async function answer(challengeId: string, answer: Answer) {
	const res = await fetch(`${base}/api/results/challenge/${challengeId}`, {
		method: 'POST',
		body: JSON.stringify(answer)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = resultFromJSON(await res.json());
	challengesWritable.update((state) => {
		const index = state.findIndex((c) => c.id === result.challengeId);
		const challenge = state[index];
		if (challenge) {
			state = state.slice();
			state[index] = { ...challenge, result };
		}
		return state;
	});
	return result;
}

export async function explain(challengeId: string) {
	const res = await fetch(`${base}/api/results/challenge/${challengeId}/explain`, {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const result: Result = resultFromJSON(await res.json());
	challengesWritable.update((state) => {
		const index = state.findIndex((c) => c.id === result.challengeId);
		const challenge = state[index];
		if (challenge) {
			state = state.slice();
			state[index] = { ...challenge, result };
		}
		return state;
	});
	return result;
}

function addOrUpdate(
	state: Array<StateChallenge>,
	challenge: StateChallenge
): Array<StateChallenge> {
	const index = state.findIndex((c) => c.id === challenge.id);
	if (index === -1) {
		state.push(challenge);
	} else {
		state[index] = challenge;
	}
	return state;
}

export function resultFromJSON(result: Result): Result {
	return {
		...result,
		createdAt: new Date(result.createdAt),
		updatedAt: new Date(result.updatedAt)
	};
}

export function challengeFromJSON(challenge: StateChallenge): StateChallenge {
	return {
		...challenge,
		releasedAt: challenge.releasedAt ? new Date(challenge.releasedAt) : challenge.releasedAt,
		createdAt: new Date(challenge.createdAt),
		updatedAt: new Date(challenge.updatedAt)
	};
}
