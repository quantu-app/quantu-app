<script lang="ts">
	import { markdown } from '@aicacia/markdown';
	import type { ITextBlock } from '$lib/state/blocks';
	import type { Text, TableRow } from 'automerge';
	import { updateBlock } from '$lib/state/blocks';
	import type Delta from 'quill-delta';
	import TextEditor from '$lib/TextEditor.svelte';

	export let block: ITextBlock & TableRow;
	export let edit: boolean;
	let prevEdit: boolean;

	let text = block.text.toString();
	let rendered = text;

	$: {
		if (edit !== prevEdit) {
			prevEdit = edit;
			text = block.text.toString();
			rendered = text;
		}
	}

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
			rendered = block.text.toString();
		});
	}
</script>

<div id={block.id}>
	{#if edit}
		<div class="row">
			<div class="col-6">
				<TextEditor {text} {onTextChange} />
			</div>
			<div class="col-6">
				{@html markdown(rendered)}
			</div>
		</div>
	{:else if text.trim()}
		{@html markdown(text)}
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<h1>Click to Edit</h1>
		</div>
	{/if}
</div>
