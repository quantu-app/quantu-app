<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import { currentUser } from '$lib/state/user';
	import SolutionList from './SolutionList.svelte';

	export let challenge: StateChallenge;
	export let solutions: StateChallengeSolution[];

	$: userSolution = solutions.find((solution) => solution.userId === $currentUser?.id);
</script>

<a class="link-dark" href={`${base}/challenges/${challenge.department.url}/${challenge.url}/review`}
	><i class="bi bi-chevron-left" /> {challenge.name}</a
>

<Challenge {challenge} disabled={true} />

{#if !userSolution}
	<div class="d-flex">
		<a
			role="button"
			class="btn btn-primary ms-auto"
			href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions/new`}
			>Add Solution</a
		>
	</div>
{/if}

<hr />

<SolutionList {challenge} {solutions} />
