<script lang="ts">
	import SortableList from '$lib/SortableList.svelte';
	import { BlockType } from '$lib/state/blocks';
	import { booksStore } from '$lib/state/books';
	import type { IBlock } from '$lib/state/blocks';
	import type { IBook } from '$lib/state/books';
	import Block from '$lib/Block/Block.svelte';
	import type { FreezeObject, TableRow } from 'automerge';
	import { onDestroy } from 'svelte';
	import TextEditor from '$lib/TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';

	export let book: IBook & TableRow;

	let blockType: BlockType = BlockType.Text;
	let blockStore = booksStore.getBookById(book.id);

	$: blocks = $blockStore.blocks.rows.sort(sortBlocks);

	function onCreateBlock() {
		blockStore.createBlock(blockType);
	}

	function onBookNameChange(event: CustomEvent<Delta>) {
		booksStore.change((doc) => {
			applyOpsToText(doc.books.byId(book.id).name, event.detail.ops);
		});
	}

	function sortBlocks(a: FreezeObject<IBlock>, b: FreezeObject<IBlock>) {
		return a.index - b.index;
	}

	function createOnDeleteBlock(block: FreezeObject<IBlock & TableRow>) {
		return function onDeleteBlock() {
			booksStore.getBookById(book.id).change((doc) => {
				doc.blocks.remove(block.id);
			});
		};
	}

	function onSort(e: CustomEvent<Array<FreezeObject<IBlock & TableRow>>>) {
		blockStore.change((doc) => {
			let index = 0;
			e.detail
				.map((block) => block.id)
				.forEach((blockId) => {
					const block = doc.blocks.byId(blockId);

					if (block) {
						block.index = index++;
					}
				});
		});
	}
	onDestroy(() => {
		booksStore.unloadBookById(book.id);
	});
</script>

<h1>
	<TextEditor text={book.name} on:textchange={onBookNameChange} />
</h1>

<SortableList
	list={blocks}
	key="id"
	let:item
	on:sort={onSort}
	klass="mt-4 list-group list-group-flush"
>
	<li class="list-group-item {book.type.toLowerCase()}">
		<div class="d-flex justify-content-between align-items-start">
			<button type="button" class="btn btn-primary drag-sort-btn"
				><i class="bi bi-arrows-move" /></button
			>
			<button
				type="button"
				class="btn-close"
				aria-label="Close"
				on:click={createOnDeleteBlock(item)}
			/>
		</div>
		<Block {blockStore} block={item} />
	</li>
</SortableList>

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
