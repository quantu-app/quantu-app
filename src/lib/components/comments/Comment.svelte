<svelte:options immutable />

<script lang="ts">
	import type { StateCommentWithChildren } from '$lib/state/comments';
	import RichViewer from '../editor/RichViewer.svelte';
	import Comments from './Comments.svelte';
	import CreateComment from './CreateComment.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let comment: StateCommentWithChildren;
</script>

<div>
	<RichViewer bind:value={comment.content} placeholder="" />
</div>
<div>
	<CreateComment {referenceId} {referenceType} commentId={comment.id} />
</div>
<Comments {referenceType} {referenceId} commentId={comment.id} />
