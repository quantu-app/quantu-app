<script lang="ts">
	import Text from './Text.svelte';
	import { onDestroy } from 'svelte';
	import type { BlocksStore, IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import type { TableRow } from 'automerge';

	export let blockStore: BlocksStore;
	export let block: IBlock & TableRow;
	let edit: boolean;

	function onWindowClick() {
		edit = false;
	}

	onDestroy(() => {
		window.removeEventListener('click', onWindowClick);
	});
</script>

<div on:click|stopPropagation={() => (edit = true)}>
	{#if block.type === BlockType.Text}
		<Text {blockStore} {block} {edit} />
	{/if}
</div>
