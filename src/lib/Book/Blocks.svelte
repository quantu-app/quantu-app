<script lang="ts">
	import SortableList from '$lib/SortableList.svelte';
	import { booksStore, BookStore } from '$lib/state/books';
	import type { IBlock } from '$lib/state/blocks';
	import Block from '$lib/Block/Block.svelte';
	import type { FreezeObject, TableRow, UUID } from 'automerge';
	import { beforeUpdate } from 'svelte';

	export let bookStore: BookStore;

	let deleteBlockId: UUID;
	let deleteBlock: IBlock;
	let deleteBlockText = '';

	$: blocks = $bookStore.blocks.rows.sort(sortBlocks);

	function sortBlocks(a: FreezeObject<IBlock>, b: FreezeObject<IBlock>) {
		return a.index - b.index;
	}

	function createOnDeleteBlock(block: FreezeObject<IBlock & TableRow>) {
		return function onDeleteBlock() {
			deleteBlockId = block.id;
			deleteBlock = block;
			deleteBlockText = '';
		};
	}

	function onDeleteBlock() {
		if (deleteBlockId) {
			booksStore.getBookById(bookStore.get().id).change((doc) => {
				doc.blocks.remove(deleteBlockId);
			});
		}
	}

	function onSort(e: CustomEvent<Array<FreezeObject<IBlock & TableRow>>>) {
		bookStore.change((doc) => {
			let index = 0;
			e.detail
				.map((block) => block.id)
				.forEach((blockId) => {
					const block = doc.blocks.byId(blockId),
						nextIndex = index++;

					if (block && block.index !== nextIndex) {
						block.index = nextIndex;
					}
				});
		});
	}

	beforeUpdate(() => {});
</script>

<div
	class="modal fade"
	id="delete-block"
	tabindex="-1"
	aria-labelledby="delete-block-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-block-label" class="modal-title">Delete {deleteBlock?.type}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group mt-4">
					<input
						type="search"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteBlockText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteBlock}
					disabled={deleteBlockText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<SortableList list={blocks} key="id" handle=".drag-sort-btn" let:item on:sort={onSort} klass="mt-4">
	<li class={`item ${$bookStore.type.toLowerCase()}`}>
		<slot {item}>
			<div class="d-flex flex-column justify-content-between align-items-center control">
				<button type="button" class="btn btn-primary btn-sm drag-sort-btn d-flex"
					><i class="bi bi-arrows-move" /></button
				>
				<button
					type="button"
					class="btn btn-danger btn-sm text-white d-flex"
					data-bs-toggle="modal"
					data-bs-target="#delete-block"
					aria-label="Delete"
					on:click={createOnDeleteBlock(item)}><i class="bi bi-trash" /></button
				>
			</div>
		</slot>
		<Block {bookStore} block={item} />
	</li>
</SortableList>

<style lang="scss">
	.control {
		display: none !important;
		height: 100%;
		position: absolute;
		left: -48px;
		top: 0;
		padding: 16px;
	}
	.item {
		position: relative;
		border-left: 1px dotted transparent;
		&:hover {
			border-left-color: #ccc;
			.control {
				display: inherit !important;
			}
		}
	}
</style>
