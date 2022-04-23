<svelte:options immutable />

<script lang="ts">
	import type { Comment } from '@prisma/client';
	import RichViewer from '../editor/RichViewer.svelte';

	export let referenceId: string;
	export let referenceType: string;
	export let commentId: string = undefined;

	let comments: Comment[] = [];
</script>

<ul class="list-group list-group-flush">
	{#each comments as comment}
		<li class="list-group-item">
			<div>
				<RichViewer bind:value={comment.content} placeholder="" />
			</div>
		</li>
	{/each}
</ul>
