<script lang="ts">
	import type { IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import Text from './Text.svelte';
	import { onMount } from 'svelte';

	export let block: IBlock;
	let edit: boolean;

	onMount(() => {
		window.addEventListener('click', () => (edit = false));
	});
</script>

<div class="mb-4" on:click|stopPropagation={() => (edit = true)}>
	{#if block.type === BlockType.Text}
		<Text {block} {edit} />
	{/if}
</div>
