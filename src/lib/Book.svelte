<script lang="ts">
	import SortableList from './SortableList.svelte';
	import { booksStore, BlockType, createBlock } from '$lib/state/books';
	import type { IBlock } from '$lib/state/books';
	import type { IBookMeta } from '$lib/state/books';
	import Block from './Block/Block.svelte';
	import type { FreezeObject, TableRow } from 'automerge';
	import { onDestroy, onMount } from 'svelte';
	import TextEditor from './TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from './utils';

	export let book: IBookMeta & TableRow;

	let blockType: BlockType = BlockType.Text;
	let bookStore = booksStore.getBookById(book.id);
	let blocksElement: HTMLUListElement;

	$: blocks = $bookStore.blocks.rows.sort(sortBlocks);

	async function onCreateBlock() {
		await createBlock(book.id, blockType);
	}

	function onBookNameChange(event: CustomEvent<Delta>) {
		booksStore.change((doc) => {
			applyOpsToText(doc.metas.byId(book.id).name, event.detail.ops);
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
		bookStore.change((doc) => {
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
	<li class="list-group-item">
		<div class="d-flex justify-content-between align-items-start">
			<button type="button" class="btn btn-primary drag-sort-btn"
				><i class="bi bi-arrows-move" /></button
			>
			<p>{item.index + 1} {item.id}</p>
			<p>{new Date(item.createdAt).toDateString()}</p>
			<button
				type="button"
				class="btn-close"
				aria-label="Close"
				on:click={createOnDeleteBlock(item)}
			/>
		</div>
		<Block bookId={book.id} block={item} />
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
