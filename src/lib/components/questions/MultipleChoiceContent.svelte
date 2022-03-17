<script lang="ts">
	import type { IElement, IText } from '$lib/components/Editor';
	import RichViewer from '$lib/components/Editor/RichViewer.svelte';
	import type { MultipleChoice } from '$lib/types';

	export let prompt: MultipleChoice;
</script>

<RichViewer value={prompt.question} />
