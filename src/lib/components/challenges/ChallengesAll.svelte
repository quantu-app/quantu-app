<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	import { challengesPath } from '$lib/routingUtils';
	interface IState {
		challengeNameFilter: string | undefined;
	}
	const state = writable<IState>({
		challengeNameFilter: undefined
	});
</script>

<script lang="ts">
	import ChallengeList from '$lib/components/challenges/ChallengeList.svelte';
	import type { StateChallenge } from '$lib/state/challenges';

	export let challenges: StateChallenge[];
</script>

<div class="container my-4 mb-8">
	<a class="link-dark" href={challengesPath()}><i class="bi bi-chevron-left" /> Challenges</a>
	<hr />
	<div class="row">
		<h2>All Challenges</h2>

		<ChallengeList {challenges} />
	</div>
</div>
