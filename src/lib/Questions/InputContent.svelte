<script lang="ts">
	import type Op from 'quill-delta/dist/Op';
	import type { QuestionInput } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';

	export let prompt: QuestionInput;
	export let showExplanation = false;
	export let explanation: Op[] = undefined;
</script>

<RichViewer content={prompt.question} />
{#if explanation && showExplanation}
	<hr />
	<RichViewer content={explanation} />
{/if}
