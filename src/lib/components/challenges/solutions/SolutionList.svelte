<svelte:options immutable />

<script lang="ts">
	import { flip } from 'svelte/animate';
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
	<ul class="list-group list-group-flush">
		{#each solutions as solution (solution.id)}
			<li class="list-group-item" animate:flip={{ duration: 200 }}>
				<SolutionListItem {challenge} {solution} {onDelete} />
			</li>
		{/each}
	</ul>
{/if}
