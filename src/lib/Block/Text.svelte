<script lang="ts">
	import type { ITextBlock } from '$lib/state/books';
	import { updateBlock } from '$lib/state/books';
	import TextEditor from '$lib/TextEditor.svelte';
	import Markdown from '$lib/Markdown.svelte';
	import { beforeUpdate } from 'svelte';
	import type { UUID, TableRow } from 'automerge';
	import { Text } from 'automerge';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';

	export let bookId: UUID;
	export let block: ITextBlock & TableRow;
	export let edit: boolean;

	let prevEdit: boolean;

	let text = block.text.toString();
	let rendered = text;

	beforeUpdate(() => {
		if (edit !== prevEdit) {
			prevEdit = edit;
			text = block.text.toString();
			rendered = text;
		}
	});

	function onTextChange(event: CustomEvent<Delta>) {
		updateBlock(bookId, block.id, (block) => {
			applyOpsToText(block.text, event.detail.ops);
			rendered = block.text.toString();
		});
	}
</script>

<div>
	{#if edit}
		<div class="row">
			<div class="col-6">
				<TextEditor {text} on:textchange={onTextChange} />
			</div>
			<div class="col-6">
				<Markdown markdown={rendered} />
			</div>
		</div>
	{:else if block.text.toString().trim()}
		<Markdown markdown={block.text.toString()} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<h1>Click to Edit</h1>
		</div>
	{/if}
</div>
