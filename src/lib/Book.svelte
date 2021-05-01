<script lang="ts">
	import type { IBook } from '$lib/state/books';
	import type { TableRow } from 'automerge';
	import Block from './Block/Block.svelte';
	import { blocksStore, createBlock, BlockType } from './state/blocks';

	export let book: IBook & TableRow;

	let blockType: BlockType = BlockType.Text;

	function onCreateBlock() {
		createBlock(book.id, blockType);
	}
</script>

<h1>{book.name}</h1>

<div class="mt-4">
	{#each $blocksStore.table.rows as block}
		<Block {block} />
	{/each}
</div>

<div class="d-flex align-items-center justify-content-center">
	<form action="javascript:void(0);" class="row mt-4">
		<div class="col-auto">
			<select
				class="form-select"
				placeholder="New Book Name"
				aria-label="New Book Name"
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
				class="form-control btn btn-primary"
				aria-label="Create Block"
				on:click={onCreateBlock}
			>
				Create Block
			</button>
		</div>
	</form>
</div>
