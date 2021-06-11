<script lang="ts">
	import Text from './Text.svelte';
	import type { IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import type { BookStore } from '$lib/state/books';
	import type { TableRow } from 'automerge';

	export let bookStore: BookStore;
	export let block: IBlock & TableRow;
</script>

{#if block.type === BlockType.Text}
	<Text {bookStore} {block} />
{/if}
