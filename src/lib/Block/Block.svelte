<script lang="ts">
	import type { IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import type { BookStore } from '$lib/state/books';
	import type { TableRow } from 'automerge';
	import Text from './Text.svelte';
	import Code from './Code.svelte';

	export let bookStore: BookStore;
	export let block: IBlock & TableRow;
</script>

{#if block.type === BlockType.Text}
	<Text {bookStore} id={block.id} text={block.text} />
{:else if block.type === BlockType.Code}
	<Code {bookStore} id={block.id} lang={block.lang} text={block.text} />
{/if}
