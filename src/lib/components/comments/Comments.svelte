<svelte:options immutable />

<script lang="ts">
	import { commentsTree, type StateComment } from '$lib/state/comments';
	import Comment from './Comment.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let commentId: string = null;

	let comments: StateComment[] = [];
	$: commentsByReferenceId = ($commentsTree[referenceType] || {})[referenceId] || {};
	$: if (commentId) {
		comments = commentsByReferenceId[commentId]?.children || [];
	} else {
		comments = Object.values(commentsByReferenceId).filter((comment) => comment.commentId === null);
	}
</script>

<ul class="list-group list-group-flush">
	{#each comments as comment (comment.id)}
		<li class="list-group-item px-0 py-2">
			<Comment {referenceId} {referenceType} {comment} />
		</li>
	{/each}
</ul>
