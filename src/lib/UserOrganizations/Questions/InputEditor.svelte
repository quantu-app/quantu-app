<script lang="ts">
	import type { QuestionInputPrivate } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import RichViewer from '$lib/RichViewer.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import type Op from 'quill-delta/dist/Op';

	export let prompt: QuestionInputPrivate;
	export let disabled = false;

	$: answers = prompt.answers || [];
	let quillEditors: { [key: string]: Quill } = {};

	$: createOnQuill = (key: string, getter: () => Op[]) => {
		return function onQuill(quill: Quill) {
			quillEditors[key] = quill;
			quill.setContents({ ops: getter() } as Delta, 'api');
		};
	};

	$: createOnQuillChange = (key: string, setter: (ops: Op[]) => void) => {
		return function onChange() {
			const quill = quillEditors[key];

			if (quill) {
				setter(quill.getContents().ops);
			}
		};
	};

	$: questionSetter = (ops: Op[]) => {
		prompt.question = ops;
	};
	$: explanationSetter = (ops: Op[]) => {
		prompt.explanation = ops;
	};

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

	$: console.log(prompt);
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
	<label for="question" class="form-label">Question</label>
	{#if disabled}
		<RichViewer content={prompt.question} />
	{:else}
		<RichEditor
			onQuill={createOnQuill('question', () => prompt.question)}
			on:textchange={createOnQuillChange('question', questionSetter)}
		/>
	{/if}
</div>

<div>
	<label for="explanation" class="form-label">Explanation</label>
	{#if disabled}
		<RichViewer content={prompt.explanation} />
	{:else}
		<RichEditor
			onQuill={createOnQuill('explanation', () => prompt.explanation)}
			on:textchange={createOnQuillChange('explanation', explanationSetter)}
		/>
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
			<input
				type="text"
				class="mt-2 form-control"
				placeholder="Type answer"
				{disabled}
				bind:value={prompt.answers[index]}
			/>
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
