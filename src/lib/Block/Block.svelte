<script lang="ts">
	import type { TableRow } from 'automerge';
	import type { IBlock } from '$lib/state/blocks';
	import { BlockType } from '$lib/state/blocks';
	import Markdown from './Markdown.svelte';
	import { onMount } from 'svelte';

	export let block: IBlock & TableRow;
	let edit: boolean;

	onMount(() => {
		window.addEventListener('click', () => (edit = false));
	});
</script>

<div class="card mb-4" on:click|stopPropagation={() => (edit = true)}>
	<div class="card-body">
		{#if block.type === BlockType.Markdown}
			<Markdown {block} {edit} />
		{/if}
	</div>
</div>
