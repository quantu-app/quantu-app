<script lang="ts">
	import type { ITextBlock } from '$lib/state/blocks';
	import { updateBlock } from '$lib/state/blocks';
	import TextEditor from '$lib/TextEditor.svelte';
	import Markdown from '$lib/Markdown.svelte';
	import { beforeUpdate } from 'svelte';

	export let block: ITextBlock;
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

	function onChange(event: CustomEvent<string>) {
		updateBlock(block.id, (block) => {
			block.text = event.detail;
			rendered = block.text;
			return block;
		});
	}
</script>

<div>
	{#if edit}
		<div class="row">
			<div class="col-6">
				<TextEditor {text} on:change={onChange} />
			</div>
			<div class="col-6">
				<Markdown markdown={rendered} />
			</div>
		</div>
	{:else if block.text.trim()}
		<Markdown markdown={block.text} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<h1>Click to Edit</h1>
		</div>
	{/if}
</div>
