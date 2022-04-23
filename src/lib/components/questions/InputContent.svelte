<svelte:options immutable />

<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { Input } from '$lib/types';

	export let prompt: Input;
</script>

<RichViewer value={prompt.question} />
