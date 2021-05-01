<script lang="ts">
	import type { ITextBlock } from '$lib/state/blocks';
	import type { Text, TableRow } from 'automerge';
	import { updateBlock } from '$lib/state/blocks';
	import Quill from '$lib/Quill.svelte';
	import type Delta from 'quill-delta';

	export let block: ITextBlock & TableRow;
	export let edit: boolean;

	let text = block.text.toString();

	function applyDeltaToText(text: Text, delta: Delta): void {
		let i = 0;
		delta.forEach((op, _idx) => {
			if (op.retain) {
				i += op.retain;
			}

			if (typeof op.insert === 'string') {
				const chars = op.insert.split('');
				text.insertAt!(i, ...chars);
				i += chars.length;
			} else if (op.delete) {
				text.deleteAt!(i, op.delete);
			}
		});
	}

	function onTextChange(delta: Delta) {
		updateBlock(block.id, (block) => {
			applyDeltaToText(block.text, delta);
			text = block.text.toString();
		});
	}
</script>

<div id={block.id}>
	{#if edit}
		<Quill {text} {onTextChange} />
	{:else if text.toString().trim()}
		{@html text.toString()}
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<h1>Click to Edit</h1>
		</div>
	{/if}
</div>
