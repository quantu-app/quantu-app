<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import Comments from '$lib/components/comments/Comments.svelte';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import { createComment } from '$lib/state/comments';

	export let challenge: StateChallenge;
	export let solution: StateChallengeSolution;

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
		} finally {
			commenting = false;
		}
	}
</script>

<a
	class="link-dark"
	href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
	><i class="bi bi-chevron-left" /> {challenge.name}</a
>

<Challenge {challenge} disabled={true} />

<hr />

<div>
	<RichViewer bind:value={solution.solution} />
</div>

<div class="d-flex justify-content-between align-items-end">
	<h3 class="mt-4 mb-0 pb-0">Comments</h3>
	{#if !replying}
		<a role="button" class="link-dark" on:click={toggleReply}>Reply to Solution</a>
	{/if}
</div>

<hr class="mt-0" />

{#if replying}
	<RichEditor bind:value={comment} showHelper />
{/if}
<div class="d-flex flex-row-reverse">
	{#if replying}
		<div class="btn-group" role="group">
			<button class="btn btn-sm btn-primary" disabled={commenting} on:click={onReply}>Reply</button>
			<button class="btn btn-sm btn-danger" disabled={commenting} on:click={toggleReply}
				>Cancel</button
			>
		</div>
	{/if}
</div>

<Comments referenceId={solution.id} referenceType="CHALLENGE_SOLUTION" />
