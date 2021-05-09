<script lang="ts">
	import type Quill from 'quill';
	import { markdown } from '@aicacia/markdown';
	import type { ITextBlock } from '$lib/state/blocks';
	import type { Text, TableRow } from 'automerge';
	import { updateBlock } from '$lib/state/blocks';
	import type Delta from 'quill-delta';
	import TextEditor from '$lib/TextEditor.svelte';
	import type { IMessage, Room } from '@aicacia/peer';
	import type Op from 'quill-delta/dist/Op';
	import { onMount } from 'svelte';

	export let block: ITextBlock & TableRow;
	export let edit: boolean;
	export let room: Room | undefined;

	let DeltaClass: typeof Delta;

	let prevRoom: Room | undefined = room;
	let prevEdit: boolean;

	let text = block.text.toString();
	let rendered = text;

	let quill: Quill | undefined;

	$: {
		if (edit !== prevEdit) {
			prevEdit = edit;
			text = block.text.toString();
			rendered = text;
		}
	}

	$: if (prevRoom !== room) {
		prevRoom?.off('message' as any, onMessage);
		room?.on('message' as any, onMessage);
		prevRoom = room;
	}

	function onQuillMount(q: Quill) {
		quill = q;
	}

	function onMessage(message: IMessage) {
		if (message.type === 'edit-text-block' && message.payload.id === block.id) {
			updateBlock(block.id, (block) => {
				applyOpsToText(block.text, message.payload.ops);
				if (edit) {
					quill?.updateContents(new DeltaClass(message.payload.ops), 'api');
					rendered = block.text.toString();
				} else {
					text = block.text.toString();
				}
			});
		}
	}

	function applyOpsToText(text: Text, ops: Op[]): void {
		let i = 0;
		for (let op of ops) {
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
		}
	}

	function onTextChange(delta: Delta) {
		updateBlock(block.id, (block) => {
			room?.broadcast('edit-text-block', {
				id: block.id,
				ops: delta.ops
			});
			applyOpsToText(block.text, delta.ops);
			rendered = block.text.toString();
		});
	}

	onMount(async () => {
		const { default: Delta } = await import('quill-delta');
		DeltaClass = Delta;
	});
</script>

<div id={block.id}>
	{#if edit}
		<div class="row">
			<div class="col-6">
				<TextEditor {text} {onTextChange} {onQuillMount} />
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
