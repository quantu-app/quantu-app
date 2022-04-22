<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import SolutionListItem from './SolutionListItem.svelte';

	export let challenge: StateChallenge;
	export let solutions: StateChallengeSolution[];
</script>

{#if !solutions.length}
	<div class="alert alert-info">No solutions yet.</div>
{/if}

{#each solutions as solution (solution.id)}
	<SolutionListItem {challenge} {solution} />
{/each}
