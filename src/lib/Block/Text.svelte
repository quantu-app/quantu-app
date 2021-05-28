<script lang="ts">
	import type { ITextBlock, BlocksStore } from '$lib/state/blocks';
	import QuillEditor from '$lib/QuillEditor.svelte';
	import Markdown from '$lib/Markdown.svelte';
	import { beforeUpdate, onMount } from 'svelte';
	import type { TableRow } from 'automerge';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';

	export let blockStore: BlocksStore;
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
		blockStore.updateBlock(block.id, (block) => {
			applyOpsToText(block.text, event.detail.ops);
			rendered = block.text.toString();
		});
	}

	onMount(() => {
		window.addEventListener('click', () => (edit = false));
	});
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
