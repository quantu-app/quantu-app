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
	import { addNotification, NotificationType } from '$lib/state/notifications';
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
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Deleting Solution',
				description: (e as Error).message
			});
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
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Deleting Solution',
				description: (e as Error).message
			});
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
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Deleting Solution',
				description: (e as Error).message
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
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Deleting Solution',
				description: (e as Error).message
			});
		} finally {
			loadingMore = false;
		}
	}

	$: yourVote = comment.votes.find((v) => v.userId === $currentUser.id)?.vote;
	async function onVote(vote: boolean | null) {
		await voteOnComment(referenceType, referenceId, comment.id, vote);
	}
</script>

<div class="d-flex flex-row">
	<div class="flex-grow-0">
		<Vote vote={yourVote} votes={comment.votes} {onVote} disabled={comment.deleted} />
	</div>
	<div class="flex-grow-1 d-flex flex-column">
		<div class="flex-grow-1">
			{#if editing}
				<RichEditor bind:value={comment.content} showHelper placeholder="Type comment..." />
			{:else}
				<RichViewer bind:value={comment.content} placeholder={comment.deleted ? 'Deleted' : ''} />
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
				{#if !comment.loaded}
					<a role="button" class="link-dark" on:click={loadMore} disabled={loadingMore}>Load More</a
					>
					{#if !editing && !replying} |{/if}
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
						{#if !comment.deleted}
							<button
								class="btn btn-sm btn-danger"
								disabled={deletingComment}
								on:click={onDeleteComment}>Delete</button
							>
						{/if}
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
