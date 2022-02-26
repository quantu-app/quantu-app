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
	import ChallengeList from './ChallengeList.svelte';
	import CreateChallenge from './CreateChallenge.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { Challenge, Topic } from '@prisma/client';

	export let path: string;
	export let topicId: string = undefined;
	export let challenges: Array<Challenge & { topic: Topic }>;

	$: filter = (challenge: Challenge) =>
		$state.challengeNameFilter ? fuzzyEquals($state.challengeNameFilter, challenge.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<CreateChallenge {path} {topicId} />
	</div>
	<Search bind:filter={$state.challengeNameFilter} />
</div>

<div class="container">
	<ChallengeList {path} {topicId} challenges={challenges.filter(filter)} />
</div>
