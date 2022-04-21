<script lang="ts">
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import { createChallengeSolution } from '$lib/state/challengeSolutions';
	import SolutionEditor from './SolutionEditor.svelte';
	import SolutionList from './SolutionList.svelte';

	export let challenge: StateChallenge;
	export let solutions: StateChallengeSolution[];

	let solution: Partial<StateChallengeSolution> = {};
	let creatingSolution = false;
	let submitingSolution = false;

	function onToggleSolution() {
		creatingSolution = !creatingSolution;
	}
	async function onSubmitSolution() {
		submitingSolution = false;
		try {
			await createChallengeSolution(challenge.department.url, challenge.url, solution);
			creatingSolution = false;
		} finally {
			submitingSolution = false;
		}
	}
</script>

<Challenge {challenge} disabled={true} />

{#if creatingSolution}
	<SolutionEditor bind:solution />
	<div class="d-flex">
		<button class="btn btn-primary ms-auto" on:click={onSubmitSolution} disabled={submitingSolution}
			>Submit</button
		>
		<button class="btn btn-secondary" on:click={onToggleSolution}>Cancel</button>
	</div>
{:else}
	<button class="btn btn-primary" on:click={onToggleSolution}>Add Solution</button>
{/if}

<hr />

<SolutionList {challenge} {solutions} />
