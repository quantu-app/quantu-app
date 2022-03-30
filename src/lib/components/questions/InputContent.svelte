<script lang="ts">
	import type { IElement, IText } from '$lib/components/editor';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { Input } from '$lib/types';

	export let prompt: Input;
</script>

<RichViewer value={prompt.question} />
