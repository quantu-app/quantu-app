<script lang="ts">
	import type Op from 'quill-delta/dist/Op';
	import type { QuestionMultipleChoice } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/components/RichViewer.svelte';

	export let prompt: QuestionMultipleChoice;
	export let showExplanation = false;
	export let explanation: Op[] = undefined;
</script>

<RichViewer content={prompt.question} />
{#if explanation && showExplanation}
	<hr />
	<RichViewer content={explanation} />
{/if}
