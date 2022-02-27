import type { Challenge, Topic } from '@prisma/client';
import { writable, get, derived } from 'svelte/store';
import { base } from '$app/paths';

const challengesWritable = writable<Array<Challenge & { topic: Topic }>>([]);

export const challengesById = derived(challengesWritable, (challenges) =>
	challenges.reduce((byId, challenge) => {
		byId[challenge.id] = challenge;
		return byId;
	}, {} as { [id: string]: Challenge & { topic: Topic } })
);
export const challengesByTopicId = derived(challengesWritable, (challenges) =>
	challenges.reduce((byTopicId, challenge) => {
		const parentChallenges = byTopicId[challenge.topicId] || (byTopicId[challenge.topicId] = []);
		parentChallenges.push(challenge);
		return byTopicId;
	}, {} as { [topicId: string]: Challenge & { topic: Topic }[] })
);
export const challengesByTopicIdUrl = derived(challengesWritable, (challenges) =>
	challenges.reduce((byTopicId, challenge) => {
		const parentChallenges = byTopicId[challenge.topicId] || (byTopicId[challenge.topicId] = {});
		parentChallenges[challenge.url] = challenge;
		return byTopicId;
	}, {} as { [topicId: string]: { [url: string]: Challenge & { topic: Topic } } })
);

export async function showChallengeByUrl(url: string, topicId: string = null) {
	const cachedChallenge = (get(challengesByTopicIdUrl)[topicId] || {})[url];
	if (cachedChallenge) {
		return cachedChallenge;
	}
	const res = await fetch(
		`${base}/api/challenges/url/${url}?${topicId ? `topicId=${topicId}` : ''}`
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challenge: Challenge & { topic: Topic } = await res.json();
	challengesWritable.update((challenges) => {
		challenges.push(challenge);
		return challenges;
	});
	return challenge;
}

export async function showChallenges(topicId?: string) {
	const res = await fetch(`${base}/api/challenges/url/${topicId ? `?topicId=${topicId}` : ''}`);
	if (!res.ok) {
		throw await res.json();
	}
	const challenges: Array<Challenge & { topic: Topic }> = await res.json();
	challengesWritable.set(challenges);
	return challenges;
}
