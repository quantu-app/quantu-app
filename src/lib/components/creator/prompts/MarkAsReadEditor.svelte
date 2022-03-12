<script lang="ts">
	import RichEditor from '$lib/components/Editor/RichEditor.svelte';
	import RichViewer from '$lib/components/Editor/RichViewer.svelte';
	import type { MarkAsReadPrivate } from '$lib/types';

	export let prompt: MarkAsReadPrivate;
	export let disabled = false;
</script>

<div class="mt-4">
	<label for="front" class="form-label">Content</label>
	{#if disabled}
		<RichViewer value={prompt.content} />
	{:else}
		<RichEditor bind:value={prompt.content} />
	{/if}
</div>
