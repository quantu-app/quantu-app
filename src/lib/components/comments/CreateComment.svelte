<svelte:options immutable />

<script lang="ts">
	import { createComment } from '$lib/state/comments';
	import type { Comment } from '@prisma/client';
	import CommentEditor from './CommentEditor.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let commentId: string = null;

	let comment: Partial<Comment> = {};

	let replying = false;
	async function onReply() {
		replying = true;
		try {
			await createComment(referenceType, referenceId, { ...comment, commentId });
			comment = {};
		} finally {
			replying = false;
		}
	}
</script>

<CommentEditor bind:comment />

<button class="btn btn-primary" on:click={onReply} disabled={replying}>Reply</button>
