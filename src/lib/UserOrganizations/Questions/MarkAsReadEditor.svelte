<script lang="ts">
	import type { QuestionMarkAsReadPrivate } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import RichViewer from '$lib/RichViewer.svelte';

	export let prompt: QuestionMarkAsReadPrivate;
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
