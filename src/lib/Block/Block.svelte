<script lang="ts">
	import type { TableRow } from 'automerge';
	import type { IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import Text from './Text.svelte';
	import { onMount } from 'svelte';
	import type { Room } from '@aicacia/peer';

	export let block: IBlock & TableRow;
	export let room: Room | undefined;
	let edit: boolean;

	onMount(() => {
		window.addEventListener('click', () => (edit = false));
	});
</script>

<div class="mb-4" on:click|stopPropagation={() => (edit = true)}>
	{#if block.type === BlockType.Text}
		<Text {block} {edit} {room} />
	{/if}
</div>
