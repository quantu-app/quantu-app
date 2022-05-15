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

	let voting = false;

	let yourVote: boolean | null = null;
	$: {
		const vote = solution.votes.find((v) => v.userId === $currentUser.id);
		if (vote) {
			yourVote = vote.vote;
		}
	}
	$: voteCount = solution.votes.reduce(
		(acc, vote) => acc + (vote.vote === true ? 1 : vote.vote === false ? -1 : 0),
		0
	);
	async function onVote(vote: boolean | null) {
		voting = true;
		try {
			await voteOnChallengeSolution(challenge.department.url, challenge.url, solution.id, vote);
		} finally {
			voting = false;
		}
	}
</script>

<div class="d-flex flex-row">
	<div class="flex-grow-0">
		<Vote vote={yourVote} count={voteCount} {onVote} disabled={voting} />
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
					<button class="btn btn-sm btn-primary" on:click={toggleEdit}>Edit</button>
				{:else if editing}
					<div class="btn-group" role="group">
						<button class="btn btn-sm btn-primary" disabled={updating} on:click={onUpdate}
							>Update</button
						>
						<button class="btn btn-sm btn-danger" disabled={updating} on:click={toggleEdit}
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
