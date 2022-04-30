<svelte:options immutable />

<script lang="ts">
	import {
		commentsTree,
		showComments,
		showCommentsById,
		type StateCommentWithChildren
	} from '$lib/state/comments';
	import { onMount } from 'svelte';
	import Comment from './Comment.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let commentId: string = null;

	let comments: StateCommentWithChildren[] = [];
	$: commentsById = ($commentsTree[referenceType] || {})[referenceId] || {};
	$: if (commentId) {
		comments = commentsById[commentId]?.children || [];
	} else {
		comments = Object.values(commentsById).filter((comment) => comment.commentId === null);
	}

	let loading = false;
	async function getComments() {
		if (loading) {
			return;
		}
		loading = true;
		try {
			if (commentId) {
				await showCommentsById(referenceType, referenceId, commentId);
			} else {
				await showComments(referenceType, referenceId);
			}
		} finally {
			loading = false;
		}
	}
	onMount(getComments);
</script>

<ul class="list-group list-group-flush">
	{#each comments as comment}
		<li class="list-group-item">
			<Comment {referenceId} {referenceType} {comment} />
		</li>
	{/each}
</ul>
