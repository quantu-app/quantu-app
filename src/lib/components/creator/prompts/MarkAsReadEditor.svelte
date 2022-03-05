<script lang="ts">
	import RichEditor from '$lib/components/RichEditor.svelte';
	import RichViewer from '$lib/components/RichViewer.svelte';
	import type { MarkAsReadPrivate } from '$lib/types';

	export let prompt: MarkAsReadPrivate;
	export let disabled = false;
</script>

<div class="mt-4">
	<label for="front" class="form-label">Content</label>
	{#if disabled}
		<RichViewer content={prompt.content} />
	{:else}
		<RichEditor bind:content={prompt.content} />
	{/if}
</div>
