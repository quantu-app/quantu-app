<svelte:options immutable />

<script lang="ts">
	import type { IElement, IText } from '$lib/components/editor';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { MultipleChoice } from '$lib/types';

	export let prompt: MultipleChoice;
</script>

<RichViewer value={prompt.question} />
