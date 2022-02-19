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
	const res = await fetch(`${base}/api/challenges/${url}?${topicId ? `topicId=${topicId}` : ''}`);
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
	const res = await fetch(`${base}/api/challenges${topicId ? `?topicId=${topicId}` : ''}`);
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Challenge[] = await res.json();
	challengesWritable.set(challenges);
	return challenges;
}
