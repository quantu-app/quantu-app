<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/challenges';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import {
		voteOnChallengeSolution,
		type StateChallengeSolution
	} from '$lib/state/challengeSolutions';
	import { base } from '$app/paths';
	import Vote from '$lib/components/ui/Vote.svelte';
	import { currentUser } from '$lib/state/user';

	export let challenge: StateChallenge;
	export let solution: StateChallengeSolution;

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
			<RichViewer value={solution.solution} />
		</div>
		<div class="d-flex flex-grow-0 justify-content-between">
			<div>
				{#if $currentUser?.id === solution.user.id}
					<a
						role="button"
						class="btn btn-sm btn-primary"
						href={`${base}/challenges/${solution.challenge.department.url}/${solution.challenge.url}/solutions/${solution.id}/edit`}
						>Edit</a
					>
				{/if}
				<a href={`${base}/user/profile/${solution.user.username}`}>{solution.user.username}</a>
			</div>
			<a
				href={`${base}/challenges/${solution.challenge.department.url}/${solution.challenge.url}/solutions/${solution.id}`}
				>View Thread ({solution.commentCount})</a
			>
		</div>
	</div>
</div>
