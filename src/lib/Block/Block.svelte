<script lang="ts">
	import Text from './Text.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import type { BookStore } from '$lib/state/books';
	import type { TableRow } from 'automerge';
	import { addEventListener, removeEventListener } from '$lib/utils';

	export let bookStore: BookStore;
	export let block: IBlock & TableRow;
	let edit: boolean;

	function onWindowClick() {
		edit = false;
	}
	function onClick() {
		edit = true;
	}

	onMount(() => {
		addEventListener('click', onWindowClick);
	});
	onDestroy(() => {
		removeEventListener('click', onWindowClick);
	});
</script>

<div on:click|stopPropagation={onClick}>
	{#if block.type === BlockType.Text}
		<Text {bookStore} {block} {edit} />
	{/if}
</div>
