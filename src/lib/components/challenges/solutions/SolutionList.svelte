<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import SolutionListItem from './SolutionListItem.svelte';

	export let challenge: StateChallenge;
	export let solutions: StateChallengeSolution[];
	export let onDelete: (solution: StateChallengeSolution) => void;
</script>

{#if !solutions.length}
	<div class="alert alert-info">No solutions yet.</div>
{:else}
	{#each solutions as solution (solution.id)}
		<SolutionListItem {challenge} {solution} {onDelete} />
	{/each}
{/if}
