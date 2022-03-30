<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { FlashCardPrivate } from '$lib/types';

	export let prompt: FlashCardPrivate;
	export let disabled = false;
</script>

<div class="mt-4">
	<label for="front" class="form-label">Front</label>
	{#if disabled}
		<RichViewer value={prompt.front} />
	{:else}
		<RichEditor bind:value={prompt.front} />
	{/if}
</div>

<hr />

<div>
	<label for="back" class="form-label">Back</label>
	{#if disabled}
		<RichViewer value={prompt.back} />
	{:else}
		<RichEditor bind:value={prompt.back} />
	{/if}
</div>
