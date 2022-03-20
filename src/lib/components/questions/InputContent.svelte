<script lang="ts">
	import type { IElement, IText } from '$lib/components/Editor';
	import RichViewer from '$lib/components/Editor/RichViewer.svelte';
	import type { Input } from '$lib/types';

	export let prompt: Input;
</script>

<RichViewer value={prompt.question} />
