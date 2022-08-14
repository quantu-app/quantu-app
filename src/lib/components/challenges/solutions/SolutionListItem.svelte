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
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import SolutionOptionsBar from './SolutionOptionsBar.svelte';

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
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Updating Solution',
				description: (e as Error).message
			});
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
	<div class="flex-grow-0 pe-2">
		<Vote vote={yourVote} votes={solution.votes} {onVote} />
	</div>
	<div class="flex-grow-1 d-flex flex-column">
		<div class="flex-grow-1 pb-3">
			{#if editing}
				<RichEditor bind:value={solution.solution} placeholder="Type Your Solution..." showHelper />
			{:else}
				<RichViewer value={solution.solution} />
			{/if}
		</div>
		<div class="d-flex flex-grow-0 justify-content-between">
			<div>
				<SolutionOptionsBar
					bind:editing
					{onUpdate}
					onDelete={internalOnDelete}
					isOwner={$currentUser?.id === solution.user.id}
					shareLink={`${base}/departments/${solution.challenge.department.url}/challenges/${solution.challenge.url}/solutions/${solution.id}`}
				/>
			</div>
			<div>
				<a href={`${base}/user/profile/${solution.user.username}`}>{solution.user.username}</a>
				|
				<span class="small text-muted">
					<TimeDisplay value={solution.createdAt} />
				</span>
			</div>
		</div>
	</div>
</div>
