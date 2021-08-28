<script lang="ts">
	import type { QuestionMultipleChoice } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';

	export let prompt: QuestionMultipleChoice;
</script>

<RichViewer content={prompt.question} />
