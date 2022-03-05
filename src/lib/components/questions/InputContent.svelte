<script lang="ts">
	import type Op from 'quill-delta/dist/Op';
	import RichViewer from '$lib/components/RichViewer.svelte';
	import type { Input } from '$lib/types';

	export let prompt: Input;
	export let showExplanation = false;
	export let explanation: Op[] = undefined;
</script>

<RichViewer content={prompt.question} />
{#if explanation && showExplanation}
	<hr />
	<RichViewer content={explanation} />
{/if}
