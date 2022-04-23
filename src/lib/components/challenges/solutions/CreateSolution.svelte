<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import { createChallengeSolution } from '$lib/state/challengeSolutions';
	import SolutionEditor from './SolutionEditor.svelte';

	export let challenge: StateChallenge;

	let solution: Partial<StateChallengeSolution> = {};
	let creatingSolution = false;

	async function onCreateSolution() {
		creatingSolution = false;
		try {
			await createChallengeSolution(challenge.department.url, challenge.url, solution);
		} finally {
			creatingSolution = false;
		}
	}
</script>

<a
	role="button"
	class="btn btn-ghost"
	href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
	><i class="bi bi-chevron-left" /> {challenge.name}</a
>

<Challenge {challenge} disabled={true} />

<SolutionEditor bind:solution />

<div class="d-flex mt-2">
	<button class="btn btn-primary ms-auto" on:click={onCreateSolution} disabled={creatingSolution}
		>Create</button
	>
</div>
