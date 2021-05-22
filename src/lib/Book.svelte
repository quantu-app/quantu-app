<script lang="ts">
	import { booksStore, BlockType, createBlock } from '$lib/state/books';
	import type { IBookMeta } from '$lib/state/books';
	import Block from './Block/Block.svelte';
	import type { TableRow } from 'automerge';
	import { onDestroy } from 'svelte';
	import TextEditor from './TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from './utils';

	export let book: IBookMeta & TableRow;

	let blockType: BlockType = BlockType.Text;
	let bookStore = booksStore.getBookById(book.id);

	async function onCreateBlock() {
		await createBlock(book.id, blockType);
	}

	function onBookNameChange(event: CustomEvent<Delta>) {
		booksStore.change((doc) => {
			applyOpsToText(doc.metas.byId(book.id).name, event.detail.ops);
		});
	}

	onDestroy(() => {
		booksStore.unloadBookById(book.id);
	});
</script>

<h1>
	<TextEditor text={book.name} on:textchange={onBookNameChange} />
</h1>

<div class="mt-4">
	{#each $bookStore.blocks.rows as block}
		<Block bookId={book.id} {block} />
	{/each}
</div>

<div class="d-flex align-items-center justify-content-center">
	<form action="javascript:void(0);" class="row mt-4">
		<div class="col-auto">
			<select
				class="form-select"
				placeholder="New Block Type"
				aria-label="New Block Type"
				required
				bind:value={blockType}
			>
				{#each Object.entries(BlockType) as [key, value]}
					<option {value}>{key}</option>
				{/each}
			</select>
		</div>
		<div class="col-auto">
			<button
				type="submit"
				class="btn btn-primary"
				aria-label="Create Block"
				on:click={onCreateBlock}
			>
				Create
			</button>
		</div>
	</form>
</div>
