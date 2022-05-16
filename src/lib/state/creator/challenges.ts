import type { Challenge } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

export type StateChallenge = Challenge & { department: { url: string; name: string } };

const challengesWritable = writable<Array<StateChallenge>>([]);

export const challenges = derived(challengesWritable, (challenges) => challenges);

export const challengesById = derived(challengesWritable, (challenges) =>
	challenges.reduce((byId, challenge) => {
		byId[challenge.id] = challenge;
		return byId;
	}, {} as { [id: string]: StateChallenge })
);
export const challengesByDepartmentId = derived(challengesWritable, (challenges) =>
	challenges.reduce((byParentId, challenge) => {
		const parentStateChallenges =
			byParentId[challenge.departmentId] || (byParentId[challenge.departmentId] = []);
		parentStateChallenges.push(challenge);
		return byParentId;
	}, {} as { [departmentId: string]: Array<StateChallenge> })
);

export async function showChallengeById(departmentId: string, id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/departments/${departmentId}/challenges/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: StateChallenge = challengeFromJSON(await res.json());
	challengesWritable.update((state) => addOrUpdate(state.slice(), challenge));
	return challenge;
}

export async function validChallengeUrl(departmentId: string, url: string) {
	const res = await fetch(
		`${base}/api/creator/departments/${departmentId}/challenges/by-url/${url}`,
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

export async function showChallenges(departmentId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/departments/${departmentId}/challenges`, {
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

export async function createChallenge(departmentId: string, body: Partial<StateChallenge>) {
	const res = await fetch(`${base}/api/creator/departments/${departmentId}/challenges`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: StateChallenge = challengeFromJSON(await res.json());
	challengesWritable.update((state) => addOrUpdate(state.slice(), challenge));
	return challenge;
}

export async function updateChallenge(
	departmentId: string,
	id: string,
	body: Partial<StateChallenge>
) {
	const res = await fetch(`${base}/api/creator/departments/${departmentId}/challenges/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: StateChallenge = challengeFromJSON(await res.json());
	challengesWritable.update((state) => addOrUpdate(state.slice(), challenge));
	return challenge;
}

export async function deleteChallenge(departmentId: string, id: string) {
	const res = await fetch(`${base}/api/creator/departments/${departmentId}/challenges/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	challengesWritable.update((state) => {
		const index = state.findIndex((challenge) => challenge.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(challenges: StateChallenge[], challenge: StateChallenge): StateChallenge[] {
	const index = challenges.findIndex((t) => t.id === challenge.id);
	if (index === -1) {
		challenges.push(challenge);
	} else {
		challenges[index] = challenge;
	}
	return challenges;
}

function challengeFromJSON(challenge: StateChallenge): StateChallenge {
	return {
		...challenge,
		createdAt: new Date(challenge.createdAt),
		updatedAt: new Date(challenge.updatedAt)
	};
}
