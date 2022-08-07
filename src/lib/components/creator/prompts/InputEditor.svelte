<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import InputAnswerEditor from './InputAnswerEditor.svelte';
	import type { InputPrivate } from '$lib/types';

	export let prompt: InputPrivate;
	export let disabled = false;
	export let onChange: () => void = () => undefined;

	$: answers = prompt.answers || [];

	$: createOnDelete = (index: number) => {
		return function onDelete() {
			const answers = prompt.answers || [];
			answers.splice(index, 1);
			prompt.answers = answers;
		};
	};

	$: onCreateAnswer = () => {
		const answers = prompt.answers || [];
		answers.push('');
		prompt.answers = answers;
	};
</script>

<div class="col-md">
	<label for="input-type" class="form-label">Input Type</label>
	<select id="input-type" class="form-select" bind:value={prompt.type} aria-label="Input Type">
		<option value="number">Number</option>
		<option value="latex">Math</option>
		<option value="text">Text</option>
	</select>
</div>

<div class="mt-4">
	<label for="question" class="form-label">Challenge</label>
	{#if disabled}
		<RichViewer value={prompt.question} />
	{:else}
		<RichEditor bind:value={prompt.question} {onChange} />
	{/if}
</div>

<div>
	<label for="explanation" class="form-label">Explanation</label>
	{#if disabled}
		<RichViewer value={prompt.explanation} />
	{:else}
		<RichEditor bind:value={prompt.explanation} {onChange} />
	{/if}
</div>

<ul class="list-group list-group-flush">
	{#each answers as _answer, index (index)}
		<li class="list-group-item px-0 pt-1">
			<div class="d-flex">
				{#if !disabled}
					<button class="ms-auto btn btn-sm btn-danger" on:click={createOnDelete(index)}
						><i class="bi bi-x" /></button
					>
				{/if}
			</div>
			<InputAnswerEditor bind:type={prompt.type} bind:input={prompt.answers[index]} {onChange} />
		</li>
	{/each}
</ul>

{#if !disabled}
	<div class="d-flex justify-content-center mt-2">
		<button
			type="button"
			class="btn btn-primary"
			on:click={onCreateAnswer}
			aria-label="Create Answer">Create Answer</button
		>
	</div>
{/if}
