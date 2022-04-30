<svelte:options immutable />

<script lang="ts">
	import { updateComment } from '$lib/state/comments';
	import type { Comment } from '@prisma/client';
	import CommentEditor from './CommentEditor.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let commentId: string = null;
	export let comment: Comment;

	let updating = false;
	async function onUpdate() {
		updating = true;
		try {
			await updateComment(referenceType, referenceId, comment.id, { ...comment, commentId });
		} finally {
			updating = false;
		}
	}
</script>

<CommentEditor bind:comment />

<button class="btn btn-primary" on:click={onUpdate} disabled={updating}>Update</button>
