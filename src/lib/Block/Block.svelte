<script lang="ts">
	import type { IBlock } from '$lib/state/documents/blocks';
	import { BlockType } from '$lib/state/documents/blocks';
	import type { DocumentStore } from '$lib/state/documents/DocumentStore';
	import type { TableRow } from 'automerge';
	import Text from './Text.svelte';
	import Code from './Code.svelte';

	export let documentStore: DocumentStore;
	export let block: IBlock & TableRow;
</script>

{#if block.type === BlockType.Text}
	<Text {documentStore} id={block.id} text={block.text} />
{:else if block.type === BlockType.Code}
	<Code {documentStore} id={block.id} language={block.language} text={block.text} />
{/if}
