<script lang="ts">
	import type { QuestionMultipleChoicePrivate } from '$lib/api/quantu-app-api';
	import MultipleChoiceBaseEditor from './MultipleChoiceBaseEditor.svelte';

	export let prompt: QuestionMultipleChoicePrivate;

	let render = true;
	let prevPrompt = prompt;
	$: if (prevPrompt !== prompt) {
		prevPrompt = prompt;
		render = false;
		setTimeout(() => (render = true), 0);
	}
</script>

{#if render}
	<MultipleChoiceBaseEditor {prompt} />
{/if}
