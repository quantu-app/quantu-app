<script lang="ts">
	import RichViewer from '$lib/components/RichViewer.svelte';
	import type { FlashCard } from '$lib/components/types';

	export let prompt: FlashCard;
	export let shown = false;
</script>

<div>
	<RichViewer content={prompt.front} />
	{#if shown}
		<hr />
		<RichViewer content={prompt.back} />
	{/if}
</div>
