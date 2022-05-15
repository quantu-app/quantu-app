<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	interface IState {
		challengeNameFilter: string | undefined;
	}
	const state = writable<IState>({
		challengeNameFilter: undefined
	});
</script>

<script lang="ts">
	import ChallengeList from '$lib/components/challenges/ChallengeList.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import type { StateChallenge } from '$lib/state/challenges';

	export let challenges: Array<StateChallenge>;

	let latestChallenge: StateChallenge;
	let previousChallenges: Array<StateChallenge> = [];

	$: isFiltered = !!$state.challengeNameFilter;
	$: filter = (challenge: StateChallenge) =>
		$state.challengeNameFilter ? fuzzyEquals($state.challengeNameFilter, challenge.name) : true;

	$: if (!isFiltered) {
		let maxDate = new Date(null);
		let challengeIndex = -1;
		for (let i = 0; i < challenges.length; i++) {
			const challengeDate = new Date(challenges[i].createdAt);
			if (challengeDate > maxDate) {
				maxDate = challengeDate;
				challengeIndex = i;
			}
		}
		if (challengeIndex !== -1) {
			latestChallenge = challenges[challengeIndex];
			const tmp = challenges.slice();
			tmp.splice(challengeIndex, 1);
			previousChallenges = tmp;
		} else {
			latestChallenge = null;
			previousChallenges = [];
		}
	}
</script>

<div class="container my-4">
	{#if challenges.length}
		<div class="row">
			<h2>All Challenges</h2>

			<ChallengeList {challenges} />
		</div>
	{/if}
</div>
