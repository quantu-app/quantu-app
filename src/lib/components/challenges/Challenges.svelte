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
	import Search from '$lib/components/Search.svelte';
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

<div class="container">
	<Search bind:filter={$state.challengeNameFilter} />
</div>

{#if isFiltered}
	<div class="container my-4">
		<ChallengeList challenges={challenges.filter(filter)} />
	</div>
{:else}
	<div class="container my-4">
		{#if latestChallenge}
			<div class="row">
				<h2 class="ps-0">Latest Challenge</h2>

				<ChallengeList challenges={[latestChallenge]} />
			</div>
		{/if}
		{#if previousChallenges.length}
			<div class="row mt-4">
				<h2 class="ps-0">Previous Challenges</h2>
				<ChallengeList challenges={previousChallenges} />
			</div>
		{/if}
	</div>
{/if}
