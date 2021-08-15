<script lang="ts">
	import type { Question, QuestionFlashCard } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import Prompt from './Prompt.svelte';

	export let question: Question;

	let result;
	let shown = false;

	$: prompt = question.prompt as QuestionFlashCard;
	$: getInput = () => result;

	function onShow() {
		shown = true;
	}
</script>

<Prompt ready={result != null} {question} {getInput}>
	<div slot="content">
		<RichViewer content={prompt.front} />
		{#if shown}
			<hr />
			<RichViewer content={prompt.back} />
		{/if}
	</div>
	<div slot="input" class="d-flex my-2">
		{#if shown}
			<div class="btn-group w-100">
				<button
					type="button"
					disabled={result === 0}
					class="btn btn-danger"
					on:click={() => (result = 0)}>No idea</button
				>
				<button
					type="button"
					disabled={result === 0.5}
					class="btn btn-secondary"
					on:click={() => (result = 0.5)}>Somewhat</button
				>
				<button
					type="button"
					disabled={result === 1}
					class="btn btn-success"
					on:click={() => (result = 1)}>Exactly</button
				>
			</div>
		{:else}
			<button type="button" class="btn btn-primary ms-auto" on:click={onShow}>Show</button>
		{/if}
	</div>
</Prompt>
