<script lang="ts">
	import type { QuestionFlashCardPrivate } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import RichViewer from '$lib/RichViewer.svelte';

	export let prompt: QuestionFlashCardPrivate;
	export let disabled = false;
</script>

<div class="mt-4">
	<label for="front" class="form-label">Front</label>
	{#if disabled}
		<RichViewer content={prompt.front} />
	{:else}
		<RichEditor bind:content={prompt.front} />
	{/if}
</div>

<hr />

<div>
	<label for="back" class="form-label">Back</label>
	{#if disabled}
		<RichViewer content={prompt.back} />
	{:else}
		<RichEditor bind:content={prompt.back} />
	{/if}
</div>
