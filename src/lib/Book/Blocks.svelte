<script lang="ts">
	import SortableList from '$lib/SortableList.svelte';
	import { booksStore, BookStore } from '$lib/state/books';
	import type { IBlock } from '$lib/state/blocks';
	import Block from '$lib/Block/Block.svelte';
	import type { FreezeObject, TableRow } from 'automerge';
	import CreateBlock from './CreateBlock.svelte';

	export let bookStore: BookStore;

	$: blocks = $bookStore.blocks.rows.sort(sortBlocks);

	function sortBlocks(a: FreezeObject<IBlock>, b: FreezeObject<IBlock>) {
		return a.index - b.index;
	}

	function createOnDeleteBlock(block: FreezeObject<IBlock & TableRow>) {
		return function onDeleteBlock() {
			booksStore.getBookById(bookStore.get().id).change((doc) => {
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
</script>

<SortableList list={blocks} key="id" handle=".drag-sort-btn" let:item on:sort={onSort} klass="mt-4">
	<li class={`item ${$bookStore.type.toLowerCase()}`}>
		<div class="d-flex justify-content-between align-items-start control">
			<button type="button" class="btn btn-primary btn-sm drag-sort-btn"
				><i class="bi bi-arrows-move" /></button
			>
			<button type="button" class="btn btn-danger btn-sm" on:click={createOnDeleteBlock(item)}
				><i class="bi bi-x" /></button
			>
		</div>
		<Block {bookStore} block={item} />
	</li>
</SortableList>

<CreateBlock {bookStore} />

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
