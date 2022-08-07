<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { MarkAsReadPrivate } from '$lib/types';

	export let prompt: MarkAsReadPrivate;
	export let disabled = false;
	export let onChange: () => void = () => undefined;
</script>

<div class="mt-4">
	<label for="front" class="form-label">Content</label>
	{#if disabled}
		<RichViewer value={prompt.content} />
	{:else}
		<RichEditor bind:value={prompt.content} {onChange} />
	{/if}
</div>
