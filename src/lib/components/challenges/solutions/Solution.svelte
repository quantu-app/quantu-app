<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Comments from '$lib/components/comments/Comments.svelte';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import {
		deleteChallengeSolutionById,
		updateChallengeSolution,
		type StateChallengeSolution
	} from '$lib/state/challengeSolutions';
	import { createComment } from '$lib/state/comments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { currentUser } from '$lib/state/user';
	import DeleteSolution from './DeleteSolution.svelte';

	export let challenge: StateChallenge;
	export let solution: StateChallengeSolution;

	let deleteOpen = false;

	let deleting = false;
	async function onDelete() {
		deleting = true;
		try {
			await deleteChallengeSolutionById(challenge.department.url, challenge.url, solution.id);
			deleteOpen = false;
			await goto(`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Deleting Solution',
				description: (e as Error).message
			});
		} finally {
			deleting = false;
		}
	}

	let editing = false;
	let updating = false;
	function toggleEdit() {
		editing = !editing;
	}
	async function onUpdate() {
		updating = true;
		try {
			await updateChallengeSolution(challenge.department.url, challenge.url, solution.id, {
				solution: solution.solution
			});
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Updating Solution',
				description: (e as Error).message
			});
		} finally {
			updating = false;
			editing = false;
		}
	}

	let comment: any[] = [];
	let commenting = false;
	let replying = false;
	function toggleReply() {
		replying = !replying;
	}
	async function onReply() {
		commenting = true;
		try {
			await createComment('CHALLENGE_SOLUTION', solution.id, { content: comment });
			comment = [];
			replying = false;
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Replying to Solution',
				description: (e as Error).message
			});
		} finally {
			commenting = false;
		}
	}
</script>

<a
	class="link-dark"
	href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
	><i class="bi bi-chevron-left" /> {challenge.name} Solutions</a
>

<Challenge {challenge} disabled={true} />

<hr />

<div>
	{#if editing}
		<RichEditor bind:value={solution.solution} showHelper placeholder="Type comment..." />
	{:else}
		<RichViewer bind:value={solution.solution} />
	{/if}
	{#if editing && !replying}
		<div class="d-flex flex-row-reverse">
			<div class="btn-group" role="group">
				<button class="btn btn-sm btn-primary" disabled={updating} on:click={onUpdate}
					>Update</button
				>
				<button class="btn btn-sm btn-secondary" disabled={updating} on:click={toggleEdit}
					>Cancel</button
				>
			</div>
		</div>
	{/if}
</div>

<div class="d-flex justify-content-between align-items-end">
	<h3 class="mt-4 mb-0 pb-0">Comments</h3>
	<div>
		{#if !replying && !editing}
			<a role="button" class="link-dark" on:click={toggleReply}>Reply to Solution</a>
		{/if}
		{#if !editing && !replying && $currentUser?.id === solution.user.id}
			<div class="btn-group" role="group">
				<button class="btn btn-sm btn-danger" disabled={deleting} aria-label="Delete Solution"
					>Delete</button
				>
				<button class="btn btn-sm btn-primary" on:click={toggleEdit}>Edit</button>
			</div>
		{/if}
	</div>
</div>

{#if replying}
	<RichEditor bind:value={comment} showHelper />
{/if}
<div class="d-flex flex-row-reverse">
	{#if replying}
		<div class="btn-group" role="group">
			<button class="btn btn-sm btn-primary" disabled={commenting} on:click={onReply}>Reply</button>
			<button class="btn btn-sm btn-secondary" disabled={commenting} on:click={toggleReply}
				>Cancel</button
			>
		</div>
	{/if}
</div>

<Comments referenceId={solution.id} referenceType="CHALLENGE_SOLUTION" />

<DeleteSolution bind:open={deleteOpen} {onDelete} />
