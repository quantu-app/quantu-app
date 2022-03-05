<script lang="ts">
	import RichViewer from '$lib/components/RichViewer.svelte';
	import type { MarkAsRead } from '$lib/types';

	export let prompt: MarkAsRead;
</script>

<div>
	<RichViewer content={prompt.content} />
</div>
