<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/challenges';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import {
		voteOnChallengeSolution,
		updateChallengeSolution,
		type StateChallengeSolution
	} from '$lib/state/challengeSolutions';
	import { base } from '$app/paths';
	import Vote from '$lib/components/ui/Vote.svelte';
	import { currentUser } from '$lib/state/user';
	import TimeDisplay from '$lib/components/ui/TimeDisplay.svelte';

	export let challenge: StateChallenge;
	export let solution: StateChallengeSolution;
	export let onDelete: (solution: StateChallengeSolution) => void;

	function internalOnDelete() {
		onDelete(solution);
	}

	let editing = false;
	function toggleEdit() {
		editing = !editing;
	}
	let updating = false;
	async function onUpdate() {
		updating = false;
		try {
			await updateChallengeSolution(challenge.department.url, challenge.url, solution.id, {
				solution: solution.solution
			});
			editing = false;
		} finally {
			updating = false;
		}
	}

	$: yourVote = solution.votes.find((v) => v.userId === $currentUser.id)?.vote;
	async function onVote(vote: boolean | null) {
		await voteOnChallengeSolution(challenge.department.url, challenge.url, solution.id, vote);
	}
</script>

<div class="d-flex flex-row">
	<div class="flex-grow-0">
		<Vote vote={yourVote} votes={solution.votes} {onVote} />
	</div>
	<div class="flex-grow-1 d-flex flex-column">
		<div class="flex-grow-1">
			{#if editing}
				<RichEditor bind:value={solution.solution} placeholder="Type Your Solution..." showHelper />
			{:else}
				<RichViewer value={solution.solution} />
			{/if}
		</div>
		<div class="d-flex flex-grow-0 justify-content-between">
			<div>
				<a href={`${base}/user/profile/${solution.user.username}`}>{solution.user.username}</a>
				|
				<TimeDisplay value={solution.createdAt} />
			</div>
			<div>
				{#if !editing && $currentUser?.id === solution.user.id}
					<div class="btn-group" role="group">
						<button class="btn btn-sm btn-primary" on:click={toggleEdit}>Edit</button>
						<button class="btn btn-sm btn-danger" on:click={internalOnDelete}>Delete</button>
					</div>
				{:else if editing}
					<div class="btn-group" role="group">
						<button class="btn btn-sm btn-primary" disabled={updating} on:click={onUpdate}
							>Update</button
						>
						<button class="btn btn-sm btn-secondary" disabled={updating} on:click={toggleEdit}
							>Cancel</button
						>
					</div>
				{/if}
				<a
					href={`${base}/challenges/${solution.challenge.department.url}/${solution.challenge.url}/solutions/${solution.id}`}
					>View Thread ({solution.commentCount})</a
				>
			</div>
		</div>
	</div>
</div>
