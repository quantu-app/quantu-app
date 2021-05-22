<script lang="ts">
	import Text from './Text.svelte';
	import { onMount } from 'svelte';
	import type { IBlock } from '$lib/state/books';
	import { BlockType } from '$lib/state/books';
	import type { TableRow, UUID } from 'automerge';

	export let bookId: UUID;
	export let block: IBlock & TableRow;
	let edit: boolean;

	onMount(() => {
		window.addEventListener('click', () => (edit = false));
	});
</script>

<div class="mb-4" on:click|stopPropagation={() => (edit = true)}>
	<div>
		{new Date(block.createdAt).toDateString()}
	</div>
	{#if block.type === BlockType.Text}
		<Text {bookId} {block} {edit} />
	{/if}
</div>
