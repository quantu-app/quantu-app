<script lang="ts">
	import Text from './Text.svelte';
	import { onDestroy } from 'svelte';
	import type { IBlock } from '$lib/state/books';
	import { BlockType } from '$lib/state/books';
	import type { TableRow, UUID } from 'automerge';

	export let bookId: UUID;
	export let block: IBlock & TableRow;
	let edit: boolean;

	function onWindowClick() {
		edit = false;
	}

	onDestroy(() => {
		window.removeEventListener('click', onWindowClick);
	});
</script>

<div on:click|stopPropagation={() => (edit = true)}>
	{#if block.type === BlockType.Text}
		<Text {bookId} {block} {edit} />
	{/if}
</div>
