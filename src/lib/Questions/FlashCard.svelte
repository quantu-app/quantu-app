<script lang="ts">
	import type { Question, QuestionFlashCard } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import Prompt from './Prompt.svelte';

	export let question: Question;
	export let answered: boolean;
	export let result: number;

	let shown = false;
	let input: number;

	$: prompt = question.prompt as QuestionFlashCard;

	function onShow() {
		shown = true;
	}
</script>

<Prompt {question} bind:answered bind:input bind:result>
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
					disabled={input === 0}
					class="btn btn-danger"
					on:click={() => (input = 0)}>No idea</button
				>
				<button
					type="button"
					disabled={input === 0.5}
					class="btn btn-secondary"
					on:click={() => (input = 0.5)}>Somewhat</button
				>
				<button
					type="button"
					disabled={input === 1}
					class="btn btn-success"
					on:click={() => (input = 1)}>Exactly</button
				>
			</div>
		{:else}
			<button type="button" class="btn btn-primary ms-auto" on:click={onShow}>Show</button>
		{/if}
	</div>
	<slot slot="extra" name="extra" />
</Prompt>
