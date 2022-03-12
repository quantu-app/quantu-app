<script lang="ts">
	import type { IElement, IText } from '$lib/components/Editor';
	import RichViewer from '$lib/components/Editor/RichViewer.svelte';
	import type { MultipleChoice } from '$lib/types';

	export let prompt: MultipleChoice;
	export let showExplanation = false;
	export let explanation: Array<IElement | IText> = undefined;
</script>

<RichViewer content={prompt.question} />
{#if explanation && showExplanation}
	<hr />
	<RichViewer content={explanation} />
{/if}
