import type { ChallengeSolution, ChallengeSolutionVote } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import { addComments, commentFromJSON, deleteCommentsByReference } from './comments';
import type { IFetch } from '$lib/utils';

export type StateChallengeSolution = ChallengeSolution & {
	user: { id: string; username: string };
	challenge: { name: string; url: string; department: { url: string } };
	votes: ChallengeSolutionVote[];
	commentCount: number;
};

export const challengeSolutionsWritable = writable<Array<StateChallengeSolution>>([]);

export const challengeSolutions = derived(
	challengeSolutionsWritable,
	(challengeSolutions) => challengeSolutions
);

export const challengeSolutionsById = derived(challengeSolutionsWritable, (challengeSolutions) =>
	challengeSolutions.reduce((byId, challengeSolution) => {
		byId[challengeSolution.id] = challengeSolution;
		return byId;
	}, {} as { [id: string]: StateChallengeSolution })
);
export const challengeSolutionsByUrl = derived(challengeSolutionsWritable, (challengeSolutions) =>
	challengeSolutions.reduce((byUrl, challengeSolution) => {
		const departments =
			byUrl[challengeSolution.challenge.department.url] ||
			(byUrl[challengeSolution.challenge.department.url] = {});
		const challengeSolutions =
			departments[challengeSolution.challenge.url] ||
			(departments[challengeSolution.challenge.url] = []);
		challengeSolutions.push(challengeSolution);
		return byUrl;
	}, {} as { [departmentUrl: string]: { [challengeUrl: string]: StateChallengeSolution[] } })
);

export async function showChallengeSolutionById(
	departmentUrl: string,
	url: string,
	id: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/departments/${departmentUrl}/challenges/${url}/solutions/${id}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challengeSolution: StateChallengeSolution = challengeSolutionFromJSON(await res.json());
	challengeSolutionsWritable.update((challengeSolutions) =>
		addOrUpdate(challengeSolutions.slice(), challengeSolution)
	);
	return challengeSolution;
}

export async function showChallengeSolutions(
	departmentUrl: string,
	challengeUrl: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/departments/${departmentUrl}/challenges/${challengeUrl}/solutions`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challengeSolutions: Array<StateChallengeSolution> = (await res.json()).map(
		challengeSolutionFromJSON
	);
	challengeSolutionsWritable.update((state) =>
		challengeSolutions.reduce(
			(state, challengeSolution) => addOrUpdate(state, challengeSolution),
			state.slice()
		)
	);
	return challengeSolutions;
}

export async function createChallengeSolution(
	departmentUrl: string,
	url: string,
	data: Partial<ChallengeSolution>
) {
	const res = await fetch(`${base}/api/departments/${departmentUrl}/challenges/${url}/solutions`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const challengeSolution: StateChallengeSolution = challengeSolutionFromJSON(await res.json());
	challengeSolutionsWritable.update((challengeSolutions) =>
		addOrUpdate(challengeSolutions.slice(), challengeSolution)
	);
	return challengeSolution;
}

export async function updateChallengeSolution(
	departmentUrl: string,
	url: string,
	id: string,
	data: Partial<ChallengeSolution>
) {
	const res = await fetch(
		`${base}/api/departments/${departmentUrl}/challenges/${url}/solutions/${id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(data)
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challengeSolution: StateChallengeSolution = challengeSolutionFromJSON(await res.json());
	challengeSolutionsWritable.update((challengeSolutions) =>
		addOrUpdate(challengeSolutions.slice(), challengeSolution)
	);
	return challengeSolution;
}

export async function voteOnChallengeSolution(
	departmentUrl: string,
	url: string,
	id: string,
	data: boolean | null
) {
	const res = await fetch(
		`${base}/api/departments/${departmentUrl}/challenges/${url}/solutions/${id}/vote`,
		{
			method: 'PATCH',
			body: JSON.stringify(data)
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challengeSolutionVote: ChallengeSolutionVote = challengeSolutionVoteFromJSON(
		await res.json()
	);
	challengeSolutionsWritable.update((state) => {
		const index = state.findIndex((c) => c.id === challengeSolutionVote.challengeSolutionId);
		const challengeSolution = state[index];

		if (index !== -1) {
			const voteIndex = challengeSolution.votes.findIndex((v) => v.id === challengeSolutionVote.id);
			const votes = challengeSolution.votes.slice();

			if (voteIndex === -1) {
				votes.push(challengeSolutionVote);
			} else {
				votes[voteIndex] = challengeSolutionVote;
			}
			state = state.slice();
			state[index] = { ...challengeSolution, votes };
		}
		return state;
	});
	return challengeSolutionVote;
}

export async function deleteChallengeSolutionById(departmentUrl: string, url: string, id: string) {
	const res = await fetch(
		`${base}/api/departments/${departmentUrl}/challenges/${url}/solutions/${id}`,
		{
			method: 'DELETE'
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const challengeSolution: StateChallengeSolution = challengeSolutionFromJSON(await res.json());
	challengeSolutionsWritable.update((state) => {
		const index = state.findIndex((c) => c.id === id);
		if (index === -1) {
			return state;
		} else {
			state = state.slice();
			state.splice(index, 1);
			return state;
		}
	});
	deleteCommentsByReference('CHALLENGE_SOLUTION', id);
	return challengeSolution;
}

function addOrUpdate(
	state: Array<StateChallengeSolution>,
	challengeSolution: StateChallengeSolution
): Array<StateChallengeSolution> {
	const index = state.findIndex((c) => c.id === challengeSolution.id);

	const comments = (challengeSolution as any).comments || [];
	delete (challengeSolution as any).comments;
	challengeSolution.commentCount = comments.length;
	if (comments.length) {
		addComments(comments.map(commentFromJSON));
	}

	if (index === -1) {
		state.push(challengeSolution);
	} else {
		state[index] = challengeSolution;
	}
	return state;
}

function challengeSolutionFromJSON(
	challengeSolution: StateChallengeSolution
): StateChallengeSolution {
	return {
		...challengeSolution,
		votes: challengeSolution.votes.map(challengeSolutionVoteFromJSON),
		createdAt: new Date(challengeSolution.createdAt),
		updatedAt: new Date(challengeSolution.updatedAt)
	};
}

function challengeSolutionVoteFromJSON(
	challengeSolutionVote: ChallengeSolutionVote
): ChallengeSolutionVote {
	return {
		...challengeSolutionVote,
		createdAt: new Date(challengeSolutionVote.createdAt),
		updatedAt: new Date(challengeSolutionVote.updatedAt)
	};
}
