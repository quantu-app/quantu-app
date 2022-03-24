import type { Challenge, Result } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';

export type StateChallenge = Challenge & {
	department: { url: string; name: string };
	result?: Result;
	solvers: number;
};

const challengesWritable = writable<Array<StateChallenge>>([]);

export const challenges = derived(challengesWritable, (challenges) => challenges);
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

export async function showChallengeByUrl(departmentUrl: string, url: string) {
	const res = await fetch(`${base}/api/departments/${departmentUrl}/challenges/${url}`);
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: StateChallenge = await res.json();
	challengesWritable.update((challenges) => addOrUpdate(challenges, challenge));
	return challenge;
}

export async function showChallenges(departmentUrl: string) {
	const res = await fetch(`${base}/api/departments/${departmentUrl}/challenges`);
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<StateChallenge> = await res.json();
	challengesWritable.update((state) =>
		challenges.reduce((state, challenge) => addOrUpdate(state, challenge), state)
	);
	return challenges;
}

export async function showAllChallenges() {
	const res = await fetch(`${base}/api/challenges`);
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<StateChallenge> = await res.json();
	challengesWritable.update((state) =>
		challenges.reduce((state, challenge) => addOrUpdate(state, challenge), state)
	);
	return challenges;
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
