<script lang="ts">
	import type { QuestionMarkAsRead } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';

	export let prompt: QuestionMarkAsRead;
</script>

<div>
	<RichViewer content={prompt.content} />
</div>
