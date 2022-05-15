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
	export let topChallenges: Array<StateChallenge>;
	export let challengesByDepartments: Array<{
		url: string;
		name: string;
		challenges: StateChallenge[];
	}>;

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
	}
</script>

<div class="container my-4">
	{#if topChallenges.length}
		<div class="row">
			<h2>Newest Challenges</h2>

			<ChallengeList challenges={topChallenges} />
		</div>
		<div class="row mt-3 text-end">
			<a href="/challenges/all">View All Challenges</a>
		</div>
	{/if}
	<hr />
	{#if challengesByDepartments.length}
		{#each challengesByDepartments as depChallenges (depChallenges.url)}
			<div class="row mt-4">
				<h2>{depChallenges.name}</h2>
				<ChallengeList challenges={depChallenges.challenges} />
			</div>
		{/each}
	{/if}
</div>
