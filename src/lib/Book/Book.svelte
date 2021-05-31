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

	async function onCreateBlock() {
		await blockStore.createBlock(blockType);
	}

	function onBookNameChange(event: CustomEvent<Delta>) {
		booksStore.change((doc) => {
			applyOpsToText(doc.books.byId(book.id).name, event.detail.ops);
		});
	}

	function onBookLocationChange(event: CustomEvent<Delta>) {
		booksStore.change((doc) => {
			applyOpsToText(doc.books.byId(book.id).location, event.detail.ops);
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
<h3>
	<TextEditor text={book.location} on:textchange={onBookLocationChange} />
</h3>

<SortableList list={blocks} key="id" handle=".drag-sort-btn" let:item on:sort={onSort} klass="mt-4">
	<li class={`item ${book.type.toLowerCase()}`}>
		<div class="d-flex justify-content-between align-items-start control">
			<button type="button" class="btn btn-primary btn-sm drag-sort-btn"
				><i class="bi bi-arrows-move" /></button
			>
			<button type="button" class="btn btn-danger btn-sm" on:click={createOnDeleteBlock(item)}
				><i class="bi bi-x" /></button
			>
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

<style lang="scss">
	.control {
		display: none !important;
		width: 32px;
		position: absolute;
		right: 0;
		top: 0;
	}
	.item {
		position: relative;
		border: 2px dotted transparent;
		&:hover {
			border-color: rgba(48, 12, 200, 0.2);
			.control {
				display: inherit !important;
			}
		}
	}
</style>
