<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import {
		createChallengeSolution,
		deleteChallengeSolutionById,
		type StateChallengeSolution
	} from '$lib/state/challengeSolutions';
	import { currentUser } from '$lib/state/user';
	import DeleteSolution from './DeleteSolution.svelte';
	import SolutionList from './SolutionList.svelte';

	export let challenge: StateChallenge;
	export let solutions: StateChallengeSolution[];

	$: userSolution = solutions.find((solution) => solution.userId === $currentUser?.id);

	let deleting = false;
	let deleteOpen = false;
	let solutionToDelete: StateChallengeSolution | undefined;
	function setSolutionToDelete(solution: StateChallengeSolution) {
		solutionToDelete = solution;
		deleteOpen = true;
	}
	async function onDelete() {
		deleting = true;
		try {
			await deleteChallengeSolutionById(
				challenge.department.url,
				challenge.url,
				solutionToDelete.id
			);
			solutionToDelete = undefined;
			deleteOpen = false;
		} finally {
			deleting = false;
		}
	}

	let adding = false;
	function toggleAdd() {
		adding = !adding;
	}
	let solution: any[] = [];
	let creating = false;
	async function onCreate() {
		creating = true;
		try {
			await createChallengeSolution(challenge.department.url, challenge.url, { solution });
			solution = [];
			adding = false;
		} finally {
			creating = false;
		}
	}
</script>

<a class="link-dark" href={`${base}/challenges/${challenge.department.url}/${challenge.url}/review`}
	><i class="bi bi-chevron-left" /> {challenge.name}</a
>

<Challenge {challenge} disabled={true} />

{#if !userSolution}
	{#if adding}
		<RichEditor bind:value={solution} placeholder="Type Your Solution..." showHelper />
	{/if}
	<div class="d-flex flex-row-reverse">
		{#if adding}
			<div class="btn-group" role="group">
				<button class="btn btn-sm btn-primary" disabled={creating} on:click={onCreate}
					>Create</button
				>
				<button class="btn btn-sm btn-secondary" disabled={creating} on:click={toggleAdd}
					>Cancel</button
				>
			</div>
		{:else}
			<button class="btn btn-primary" on:click={toggleAdd}>Add a Solution</button>
		{/if}
	</div>
{/if}

<hr />

<SolutionList {challenge} {solutions} onDelete={setSolutionToDelete} />
<DeleteSolution bind:open={deleteOpen} {onDelete} />
