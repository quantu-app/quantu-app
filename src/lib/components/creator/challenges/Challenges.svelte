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
	import type { Challenge } from '@prisma/client';

	export let organizationId: number;
	export let challenges: Challenge[];

	$: filter = (challenge: Challenge) =>
		$state.challengeNameFilter ? fuzzyEquals($state.challengeNameFilter, challenge.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<CreateChallenge {organizationId} quizId={null} />
	</div>
	<Search bind:filter={$state.challengeNameFilter} />
</div>

<div class="container">
	<ChallengeList {organizationId} challenges={challenges.filter(filter)} />
</div>
