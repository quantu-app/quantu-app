<svelte:options immutable />

<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { MarkAsRead } from '$lib/types';

	export let prompt: MarkAsRead;
</script>

<div>
	<RichViewer value={prompt.content} />
</div>
