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

	$: isFiltered = !!$state.challengeNameFilter;
	$: filter = (challenge: StateChallenge) =>
		$state.challengeNameFilter ? fuzzyEquals($state.challengeNameFilter, challenge.name) : true;
</script>

<div class="container my-4">
	{#if challenges.length}
		<div class="row">
			<h2>All Challenges</h2>

			<ChallengeList {challenges} />
		</div>
	{/if}
</div>
