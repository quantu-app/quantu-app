<script lang="ts">
	import type { ITextBlock } from '$lib/state/blocks';
	import type { BookStore } from '$lib/state/books';
	import QuillEditor from '$lib/QuillEditor.svelte';
	import Markdown from '$lib/Markdown.svelte';
	import { beforeUpdate } from 'svelte';
	import type { TableRow } from 'automerge';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';

	export let bookStore: BookStore;
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
		bookStore.updateBlock(block.id, (block) => {
			applyOpsToText(block.text, event.detail.ops);
			rendered = block.text.toString();
		});
	}
</script>

<div>
	{#if edit}
		<div class="row">
			<div class="col-6">
				<QuillEditor {text} on:textchange={onTextChange} />
			</div>
			<div class="col-6">
				<Markdown markdown={rendered} />
			</div>
		</div>
	{:else if text.trim()}
		<Markdown markdown={text.toString()} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<h3>Click to Edit</h3>
		</div>
	{/if}
</div>
