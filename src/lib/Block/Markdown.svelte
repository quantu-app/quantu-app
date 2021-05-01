<script lang="ts">
	import type { IMarkdownBlock } from '$lib/state/blocks';
	import type { TableRow } from 'automerge';
	import { updateBlock } from '$lib/state/blocks';
	import { Marked } from '@ts-stack/markdown';

	export let block: IMarkdownBlock & TableRow;
	export let edit: boolean;

	let markdown: string = block.markdown;

	function onChange() {
		updateBlock(block.id, (block) => {
			block.markdown = markdown;
		});
	}
</script>

<div id={block.id}>
	{#if edit}
		<div class="row">
			<div class="col-sm-12 col-lg-6">
				<textarea
					class="form-control"
					placeholder="New Book Name"
					aria-label="New Book Name"
					rows={markdown.split('\n').length}
					required
					ally-autofocus
					bind:value={markdown}
					on:change={onChange}
				/>
			</div>
			<div class="col-sm-12 col-lg-6">
				{@html Marked.parse(markdown)}
			</div>
		</div>
	{:else if markdown.trim()}
		{@html Marked.parse(markdown)}
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<h1>Click to Edit</h1>
		</div>
	{/if}
</div>
