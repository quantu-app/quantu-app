<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';

	import { base } from '$app/paths';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import { updateChallengeSolution } from '$lib/state/challengeSolutions';
	import SolutionEditor from './SolutionEditor.svelte';

	export let challenge: StateChallenge;
	export let solution: Partial<StateChallengeSolution> = {};

	let updatingSolution = false;

	async function onUpdateSolution() {
		updatingSolution = false;
		try {
			await updateChallengeSolution(challenge.department.url, challenge.url, solution.id, solution);
			await goto(`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`);
		} finally {
			updatingSolution = false;
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
	<button class="btn btn-primary ms-auto" on:click={onUpdateSolution} disabled={updatingSolution}
		>Update</button
	>
</div>
