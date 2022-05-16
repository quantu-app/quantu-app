<svelte:options immutable />

<script context="module" lang="ts">
	function sortByVotes(a: StateComment, b: StateComment): number {
		const voteDiff = b.votes.reduce(countVotes, 0) - a.votes.reduce(countVotes, 0);
		const dateDiff = +b.createdAt - +a.createdAt;
		return voteDiff === 0 ? dateDiff : voteDiff;
	}
</script>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { commentsByReference, type StateComment } from '$lib/state/comments';
	import Comment from './Comment.svelte';
	import { countVotes } from '../ui/Vote.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let commentId: string = null;

	$: byReference = ($commentsByReference[referenceType] || {})[referenceId] || [];
	$: comments = byReference.filter((comment) => comment.commentId === commentId).sort(sortByVotes);
</script>

{#if comments.length}
	<hr />
{/if}

<ul class="list-group list-group-flush">
	{#each comments as comment (comment.id)}
		<li class="list-group-item px-0 py-2" animate:flip={{ duration: 200 }}>
			<Comment {referenceId} {referenceType} {comment} />
		</li>
	{/each}
</ul>
