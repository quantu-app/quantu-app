import type { Challenge } from '@prisma/client';
import { writable, get, derived } from 'svelte/store';
import { base } from '$app/paths';

const challengesWritable = writable<Challenge[]>([]);

export const challengesById = derived(challengesWritable, (challenges) =>
	challenges.reduce((byId, challenge) => {
		byId[challenge.id] = challenge;
		return byId;
	}, {} as { [id: string]: Challenge })
);
export const challengesByTopicId = derived(challengesWritable, (challenges) =>
	challenges.reduce((byParentId, challenge) => {
		const parentChallenges = byParentId[challenge.topicId] || (byParentId[challenge.topicId] = []);
		parentChallenges.push(challenge);
		return byParentId;
	}, {} as { [topicId: string]: Challenge[] })
);
export const challengesByParentIdUrl = derived(challengesWritable, (challenges) =>
	challenges.reduce((byParentId, challenge) => {
		const parentChallenges = byParentId[challenge.topicId] || (byParentId[challenge.topicId] = {});
		parentChallenges[challenge.url] = challenge;
		return byParentId;
	}, {} as { [topicId: string]: { [url: string]: Challenge } })
);

export async function showChallengeByUrl(url: string, topicId: string = null) {
	const cachedChallenge = (get(challengesByParentIdUrl)[topicId] || {})[url];
	if (cachedChallenge) {
		return cachedChallenge;
	}
	const res = await fetch(
		`${base}/api/challenges/url/${url}?${topicId ? `topicId=${topicId}` : ''}`
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: Challenge = await res.json();
	challengesWritable.update((challenges) => {
		challenges.push(challenge);
		return challenges;
	});
	return challenge;
}

export async function showChallenges(topicId?: string) {
	const res = await fetch(`${base}/api/creator/challenges${topicId ? `?topicId=${topicId}` : ''}`);
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Challenge[] = await res.json();
	challengesWritable.set(challenges);
	return challenges;
}

export async function createChallenge(body: Partial<Challenge>) {
	const res = await fetch(`${base}/api/creator/challenges`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: Challenge = await res.json();
	challengesWritable.update((challenges) => {
		challenges.push(challenge);
		return challenges;
	});
	return challenge;
}

export async function updateChallenge(id: string, body: Partial<Challenge>) {
	const res = await fetch(`${base}/api/creator/challenges/id/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: Challenge = await res.json();
	challengesWritable.update((challenges) => {
		const index = challenges.findIndex((challenge) => challenge.id === id);
		if (index === -1) {
			challenges.push(challenge);
		} else {
			challenges[index] = challenge;
		}
		return challenges;
	});
	return challenge;
}

export async function deleteChallenge(id: string) {
	const res = await fetch(`${base}/api/creator/challenges/id/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	challengesWritable.update((challenges) => {
		const index = challenges.findIndex((challenge) => challenge.id === id);
		if (index !== -1) {
			challenges.splice(index, 1);
		}
		return challenges;
	});
}
