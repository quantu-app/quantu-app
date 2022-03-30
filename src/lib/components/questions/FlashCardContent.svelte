<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { FlashCard } from '$lib/types';

	export let prompt: FlashCard;
	export let shown = false;
</script>

<div>
	<RichViewer value={prompt.front} />
	{#if shown}
		<hr />
		<RichViewer value={prompt.back} />
	{/if}
</div>
