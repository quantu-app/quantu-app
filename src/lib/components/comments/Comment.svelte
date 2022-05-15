<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import {
		createComment,
		deleteComment,
		showCommentsById,
		updateComment,
		voteOnComment,
		type StateComment
	} from '$lib/state/comments';
	import { currentUser } from '$lib/state/user';
	import RichEditor from '../editor/RichEditor.svelte';
	import RichViewer from '../editor/RichViewer.svelte';
	import TimeDisplay from '../ui/TimeDisplay.svelte';
	import Vote from '../ui/Vote.svelte';
	import Comments from './Comments.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let comment: StateComment;

	let deletingComment = false;
	async function onDeleteComment() {
		deletingComment = true;
		try {
			await deleteComment(referenceType, referenceId, comment.id);
		} finally {
			deletingComment = false;
		}
	}

	let replyContent: any[] = [];
	let commenting = false;
	let replying = false;
	function toggleReply() {
		replying = !replying;
	}
	async function onReply() {
		commenting = true;
		try {
			await createComment(referenceType, referenceId, {
				commentId: comment.id,
				content: replyContent
			});
			replyContent = [];
			replying = false;
		} finally {
			commenting = false;
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
			await updateComment(referenceType, referenceId, comment.id, {
				content: comment.content
			});
		} finally {
			updating = false;
			editing = false;
		}
	}

	let loadingMore = false;
	async function loadMore() {
		loadingMore = true;
		try {
			await showCommentsById(referenceType, referenceId, comment.id);
		} finally {
			loadingMore = false;
		}
	}

	let voting = false;

	let yourVote: boolean | null = null;
	$: {
		const vote = comment.votes.find((v) => v.userId === $currentUser.id);
		if (vote) {
			yourVote = vote.vote;
		}
	}
	$: voteCount = comment.votes.reduce(
		(acc, vote) => acc + (vote.vote === true ? 1 : vote.vote === false ? -1 : 0),
		0
	);
	async function onVote(vote: boolean | null) {
		voting = true;
		try {
			await voteOnComment(referenceType, referenceId, comment.id, vote);
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
				<RichEditor bind:value={comment.content} showHelper placeholder="Type comment..." />
			{:else}
				<RichViewer bind:value={comment.content} />
			{/if}
		</div>
		<div class="d-flex flex-grow-0 justify-content-between">
			<div>
				<a href={`${base}/user/profile/${comment.user.username}`} target="_blank"
					>{comment.user.username}</a
				>
				|
				<TimeDisplay value={comment.createdAt} />
			</div>
			<div>
				{#if !comment.children.length}
					<a role="button" class="link-dark" on:click={loadMore} disabled={loadingMore}>Load More</a
					>
				{/if}
				{#if !editing && !replying}
					<a role="button" class="link-dark" on:click={toggleReply}>Reply to Comment</a>
				{/if}
				{#if editing && !replying}
					<div class="btn-group" role="group">
						<button class="btn btn-sm btn-primary" disabled={updating} on:click={onUpdate}
							>Update</button
						>
						<button class="btn btn-sm btn-secondary" disabled={updating} on:click={toggleEdit}
							>Cancel</button
						>
					</div>
				{/if}
				{#if !editing && !replying && $currentUser?.id === comment.user.id}
					<div class="btn-group" role="group">
						<button
							class="btn btn-sm btn-danger"
							disabled={deletingComment}
							on:click={onDeleteComment}>Delete</button
						>
						<button class="btn btn-sm btn-primary" on:click={toggleEdit}>Edit</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if replying}
	<RichEditor bind:value={replyContent} showHelper />
	<div class="d-flex flex-row-reverse">
		<div class="btn-group" role="group">
			<button class="btn btn-sm btn-primary" disabled={commenting} on:click={onReply}>Reply</button>
			<button class="btn btn-sm btn-secondary" disabled={commenting} on:click={toggleReply}
				>Cancel</button
			>
		</div>
	</div>
{/if}

<div class="ps-4">
	<Comments {referenceType} {referenceId} commentId={comment.id} />
</div>
