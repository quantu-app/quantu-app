<script lang="ts">
	import type { QuestionFlashCard } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';

	export let prompt: QuestionFlashCard;
	export let shown = false;
</script>

<div>
	<RichViewer content={prompt.front} />
	{#if shown}
		<hr />
		<RichViewer content={prompt.back} />
	{/if}
</div>
